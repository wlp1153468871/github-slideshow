<template>
  <dao-dialog
    :header="isUpdate? '更新用户权限' : '添加用户'"
    :visible.sync="isShow"
    @before-open="init"
    @closed="closed"
  >
    <dao-setting-section>
      <dao-setting-item>
        <template #label>用户信息</template>
        <template #content>
          <template v-if="!isUpdate">
            <dao-select
              v-model="formModel.user_id"
              :with-search="true"
              name="user_id"
              v-validate.immediate="'required'"
              placeholder="请输入一位用户的邮箱"
              search-placeholder="请输入一位用户的邮箱"
              no-data-text="无用户"
              no-match-text="无匹配用户"
            >
              <dao-option
                v-for="(option, index) in options"
                :key="index"
                :value="option.id"
                :label="option.value"
              >
                <!-- {{ option.text }} -->
              </dao-option>
            </dao-select>
          </template>
          <template v-else>
            {{ model.username }}
          </template>
        </template>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <template #label>项目组权限</template>
        <template #content>
          <dao-select
            placeholder="请选择"
            name="space_role"
            v-validate.immediate="'required'"
            :disabled="!isPlatformView &&model.username===userName && $can('space.base','space')"
            v-model="formModel.space_role"
          >
            <dao-option
              v-for="(value, key) in spacerole"
              :key="key"
              :value="value"
              :label="value.name"
            >
            </dao-option>
          </dao-select>
        </template>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <template #label>可用区权限</template>
        <template #content>
          <div class="dao-setting-patch role">
            <div
              class="sub-setting-layout role"
              v-for="(zone, index) in zones"
              :key="index"
            >
              <div class="sub-setting-section">
                <div class="sub-setting-item">
                  <p style="font-size: 13px">可用区</p>
                  <div class="zone">{{ zone.name }}</div>
                </div>
                <div class="sub-setting-item">
                  <p style="font-size: 13px">权限</p>
                  <dao-select
                    placeholder="请选择"
                    name="zone_space_roles"
                    style="width: 157px;"
                    v-model="formModel.zoneRoles[zone.name]"
                  >
                    <dao-option
                      v-for="(role, key) in zonerole[zone.name]"
                      :key="key"
                      :value="role"
                      :label="role.name"
                    >
                    </dao-option>
                  </dao-select>
                </div>
              </div>
            </div>
          </div>
        </template>
      </dao-setting-item>
    </dao-setting-section>
    <div slot="footer">
      <button
        class="dao-btn ghost"
        @click="onClose"
      >
        取消
      </button>
      <button
        class="dao-btn blue"
        :disabled="!valid"
        @click="onConfirm"
      >
        确定
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { isEmpty, cloneDeep } from 'lodash';
import UserService from '@/core/services/user.service';
import RoleService from '@/core/services/role.service';

export default {
  name: 'AddUserDialog',

  props: {
    spaceId: { type: String, default: '' },
    isPlatformView: { type: Boolean, default: true },
    visible: { type: Boolean, default: false },
    users: { type: Array, default: () => [] },
    zones: { type: Array, default: () => [] },
    model: { type: Object, default: () => ({}) },
    zonerole: { type: Object, default: () => ({}) },
    spacerole: { type: Array, default: () => [] },
  },

  data() {
    return {
      roleOptions: [],
      formModel: {
        user_id: null,
        space_role: null,
        zoneRoles: {},
      },
      result: {},
      user: {},
    };
  },

  watch: {
    model: {
      immediate: true,
      handler(model) {
        this.user = cloneDeep(model);
      },
    },
  },

  computed: {
    ...mapState(['org']),
    ...mapGetters(['userName']),
    isShow: {
      set() {
        this.$emit('close');
      },
      get() {
        return this.visible;
      },
    },

    isUpdate() {
      return !isEmpty(this.model);
      // return !isEmpty(this.roleOptions);
    },

    options() {
      return this.users.map(user => ({
        text: `${user.email} ${user.username ? `(${user.username})` : ''}`,
        value: user.email,
        username: user.username,
        id: user.id,
      }));
    },

    valid() {
      return !this.veeErrors.any();
    },
  },

  methods: {
    init() {
      if (this.isUpdate) {
        // 进入到更新 初始化角色
        this.formModel.user_id = this.user.id;

        // 设置项目组权限
        this.formModel.space_role = this.user.roles.find(r => r.scope === 'space');

        // 设置可用区权限
        const zoneRoles = {};
        this.zones.forEach(z => {
          const userZoneRoleName = this.user.zone_space_roles.find(r => r.zone_name === z.name);
          const userZoneRole = this.zonerole[userZoneRoleName.zone_name].find(
            r => r.name === userZoneRoleName.zone_role,
          );
          zoneRoles[z.name] = userZoneRole;
        });
        this.formModel.zoneRoles = zoneRoles;
      } else {
        // this.formModel.name = '';
        // this.formModel.user_id = getValue(first(this.users), 'id');
      }
    },
    onConfirm() {
      this.$validator.validateAll().then(valid => {
        if (valid) {
          if (this.isUpdate) {
            this.setUserZoneRole();
            this.setUserSpaceRole();
          } else {
            this.addUser().then(() => {
              this.setUserZoneRole();
              this.setUserSpaceRole();
            });
          }
        }
      });
    },

    setUserRole() {
      this.setUserSpaceRole();
      this.setUserZoneRole();
    },

    setUserSpaceRole() {
      // 修改项目组角色（权限）
      const spaceParams = {
        userId: this.formModel.user_id,
        roleId: this.formModel.space_role.id,
        data: {
          organizationId: this.org.id,
          spaceId: this.spaceId,
          scope: this.formModel.scope,
        },
      };
      RoleService.setRole(spaceParams)
        .then(() => {
          this.$noty.success(this.isUpdate ? '更新项目组权限成功' : '初始化项目组权限成功');
        })
        .catch(() => {
          this.$noty.error(this.isUpdate ? '更新项目组权限失败' : '初始化项目组权限失败');
        });
    },

    setUserZoneRole() {
      this.zones.forEach(zone => {
        const { name, id } = zone;
        if (this.formModel.zoneRoles[name]) {
          const zoneParams = {
            userId: this.formModel.user_id,
            roleId: this.formModel.zoneRoles[name].id,
            data: {
              organizationId: this.org.id,
              spaceId: this.spaceId,
              zoneId: id,
              scope: this.formModel.zoneRoles[name].scope,
            },
          };
          RoleService.setRole(zoneParams)
            .then(() => {
              this.onRefresh();
              this.$noty.success(
                this.isUpdate ? `更新可用区${name}权限成功` : `初始化可用区${name}权限成功`,
              );
            })
            .catch(() => {
              this.$noty.error(
                this.isUpdate ? `更新可用区${name}权限失败` : `初始化可用区${name}权限失败`,
              );
            });
        }
      });
    },
    addUser() {
      return UserService.updateSpaceUser(this.spaceId, {
        user_id: this.formModel.user_id,
      }).catch(err => {
        this.$noty.error('添加用户失败');
        throw err;
      });
    },

    onClose() {
      this.$emit('close');
    },

    onRefresh() {
      this.onClose();
      this.$emit('refresh');
    },

    closed() {
      this.$validator.reset();
      this.formModel = {
        user_id: null,
        space_role: null,
        zoneRoles: {},
      };
    },

    getZoneName(type) {
      let zoneName = '';
      this.zones.forEach(zone => {
        if (zone.name.includes(type)) {
          zoneName = zone.name;
        }
      });
      return zoneName;
    },
  },
};
</script>

<style lang="scss" scoped>
.dao-setting-patch.role {
  .sub-setting-layout.role {
    &:not(:first-child) {
      margin-top: 10px;
    }

    .zone {
      width: 196px;
      height: 32px;
      line-height: 32px;
      margin-right: 10px;
      padding: 0 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      border-radius: 4px;
      background: #f5f7fa;
    }
  }
}
</style>
