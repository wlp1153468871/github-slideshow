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
                {{ option.text }}
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
            name="space_role"
            v-validate.immediate="'required'"
            v-model="formModel">
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
                  <p>可用区</p>
                  <div class="zone">{{ zone.name }}</div>
                </div>
                <div class="sub-setting-item">
                  <p>权限</p>
                  <dao-select
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
import { mapState, mapGetters } from 'vuex';
import { get as getValue, first, isEmpty } from 'lodash';
// import { SPACE_ROLE_LABEL as roleOptions } from '@/core/constants/role';
import UserService from '@/core/services/user.service';
import RoleService from '@/core/services/role.service';

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
      formModel: {},
      result: {},
    };
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
      // this.loadRoleOptions();
      if (this.isUpdate) {
        // this.formModel.space_role = this.model.space_role;
        // this.formModel.user_id = this.model.id;
      } else {
        this.formModel.space_role = first(Object.keys(this.spacerole));
        this.formModel.user_id = getValue(first(this.users), 'id');
      }
    },
    onConfirm() {
      this.$validator.validateAll().then(valid => {
        if (valid) {
          this.addUser();
        }
      });
    },

    addUser() {
      console.log('this.formModel', this.formModel);
      console.log('resluts', this.result);
      const spaceParams = {
        userId: this.model.id,
        roleId: this.formModel.id,
        data: {
          // userId: this.model.id,
          // scope: this.formModel.scope,
          // scopeId: this.spaceId,
          // roleId: this.formModel.id,
          organizationId: this.org.id,
          spaceId: this.spaceId, 
          // zoneId: this.zone.id,
          scope: this.formModel.scope,
        },
      };
      // 3-12
      console.log('params', spaceParams);
      RoleService.setRole(spaceParams)
        .then(data => {
          console.log('data', data);
          // this.onRefresh();
          this.$noty.success(this.isUpdate ? '成功更新用户权限' : '添加用户成功');
        });
      this.zones.map(zone => {
        const { name, id } = zone;
        const key = name;
        const zoneParams = {
          userId: this.model.id,
          roleId: this.result[key].id,
          data: {
            organizationId: this.org.id,
            spaceId: this.spaceId, 
            zoneId: id,
            scope: this.result[key].scope,
          },
        };
        console.log('zoneParams', zoneParams);
        RoleService.setRole(zoneParams)
          .then(data => {
            console.log('data', data);
            this.onRefresh();
            this.$noty.success('成功更新可用区权限');
          });
      });
      if (!this.isUpdate) {
        UserService.updateSpaceUser(this.spaceId, {
          user_id: getValue(first(this.users), 'id'),
          space_role: this.formModel.name,
        }).then(() => {
          this.onRefresh();
          this.$noty.success('添加用户成功');
        });
      }
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
    },
  },
};
</script>
