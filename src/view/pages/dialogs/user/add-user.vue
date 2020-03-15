<template>
  <dao-dialog
    :header="isUpdate? '更新用户权限' : '添加用户'"
    :visible.sync="isShow"
    @before-open="init"
    @closed="closed">
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
              no-match-text="无匹配用户">
              <dao-option
                v-for="(option, index) in options"
                :key="index"
                :value="option.id"
                :label="option.value">
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
            @change="$set(formModel, formModel.space_role, $event)"
            placeholder="请选择"
            name="space_role"
            v-validate.immediate="'required'"
            v-model="formModel.space_role">
            <dao-option
              v-for="(value, key) in spacerole"
              :key="key"
              :value="value"
              :label="value.name">
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
              :key="index">
              <div class="sub-setting-section">
                <div class="sub-setting-item">
                  <p style="font-size: 13px">可用区</p>
                  <div class="zone">{{ zone.name }}</div>
                </div>
                <div class="sub-setting-item">
                  <p style="font-size: 13px">权限</p>
                  <dao-select
                    @change="$set(result, result[zone.name], $event)"
                    placeholder="请选择"
                    name="zone_space_roles"
                    v-validate.immediate="'required'"
                    style="width: 157px;"
                    v-model="result[zone.name]">
                    <dao-option
                      v-for="(role, key) in zonerole[zone.name]"
                      :key="key"
                      :value="role"
                      :label="role.name">
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
        @click="onClose">
        取消
      </button>
      <button
        class="dao-btn blue"
        :disabled="!valid"
        @click="onConfirm">
        确定
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import { mapState } from 'vuex';
import { get as getValue, first, isEmpty, cloneDeep } from 'lodash';
import UserService from '@/core/services/user.service';
import RoleService from '@/core/services/role.service';
import SpaceService from '@/core/services/space.service';

export default {
  name: 'AddUserDialog',

  props: {
    spaceId: { type: String, default: '' },
    visible: { type: Boolean, default: false },
    users: { type: Array, default: () => [] },
    model: { type: Object, default: () => ({}) },
    zonerole: { type: Object, default: () => ({}) },
    spacerole: [Array, Object],
  },

  data() {
    return {
      roleOptions: [],
      formModel: {
        name: 1,
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
    ...mapState(['zones', 'org', 'zone']),
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
        this.formModel.user_id = this.model.id;
        // 进入到更新 初始化角色
        const { roles } = this.model;
        // console.log(roles);
        roles.map(role => {
          // console.log('role', role);
          if (role.scope.includes('space')) {
            // space
            this.$set(this.formModel, 'space_role', role);
            // this.formModel.space_role = role;
          } else if (role.scope.includes('k8s')) {
            // zone k8s
            // this.result['k8s-dev'] = role;
            // this.$set(this.result, 'k8s-dev', role);
            this.$set(this.result, this.getZoneName('k8s'), role);
          } else if (role.scope.includes('ocp')) {
            // zone ocp
            // this.result['office-openshift-dev'] = role;
            // this.$set(this.result, 'office-openshift-dev', role);
            this.$set(this.result, this.getZoneName('openshift'), role);
          }
        });
      } else {
        // this.formModel.name = '';
        // this.formModel.user_id = getValue(first(this.users), 'id');
      }
    },
    onConfirm() {
      this.$validator.validateAll().then(valid => {
        if (valid) {
          this.setUserRole();
        }
      });
    },

    setUserRole() {
      this.setSpaceRole();
      this.setZoneRole();
    },

    setSpaceRole() {
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
        .then(data => {
          console.log('data', data);
          this.$noty.success('更新项目组权限成功');
        });
    },

    setZoneRole() {
      this.zones.map(zone => {
        const { name, id } = zone;
        const key = name;
        const zoneParams = {
          userId: this.formModel.user_id,
          roleId: this.result[key].id,
          data: {
            organizationId: this.org.id,
            spaceId: this.spaceId,
            zoneId: id,
            scope: this.result[key].scope,
          },
        };
        const zone_space_roles = [{
          zone_id: id,
          zone_name: name,
          zone_role: 'zone_admin',
        }];
        this.authorizeZone(zone_space_roles);
        RoleService.setRole(zoneParams)
          .then(data => {
            console.log('data', data);
            this.onRefresh();
            this.$noty.success('更新可用区权限成功');
          });
        return true;
      });
      if (!this.isUpdate) {
        this.addUser();
      }
    },
    addUser() {
      UserService.updateSpaceUser(this.spaceId, {
        user_id: this.formModel.user_id,
        space_role: this.formModel.space_role.name,
      }).then(() => {
        this.onRefresh();
        this.$noty.success('添加用户成功');
      });
    },
    authorizeZone(zone_space_roles) {
      // console.log('this.formModel.user_id', this.formModel.user_id);
      return SpaceService.authorizeZone(this.spaceId, this.formModel.user_id, {
        zone_space_roles,
      })
        .then(() => {
        })
        .finally(() => {
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
      };
      this.result = {};
    },

    getZoneName(type) {
      let zoneName = '';
      // console.log('type', type);
      this.zones.map(zone => {
        if (zone.name.includes(type)) {
          zoneName = zone.name;
        }
        return true;
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
