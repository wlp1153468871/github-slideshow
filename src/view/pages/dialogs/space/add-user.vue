<template>
  <dao-dialog
    :config="config"
    :visible.sync="isShow"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose">
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">用户信息</div>
        <div slot="content">
          <dao-select
            v-model="userId"
            placeholder="请输入一位用户的手机号"
            :with-search="true"
            search-placeholder="请输入一位用户的手机号"
            no-data-text="无选项"
            no-match-text="无匹配选项">
            <dao-option-group>
              <dao-option
                v-for="(option, index) in options"
                :key="index"
                :value="option.id"
                :label="option.value">
                {{ option.text }}
              </dao-option>
            </dao-option-group>
          </dao-select>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">权限</div>
        <div slot="content">
          <dao-select v-model="role">
            <dao-option
              v-for="(label, key) in spaceRoleOptions"
              :value="key"
              :key="key"
              :label="label">
            </dao-option>
          </dao-select>
        </div>
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
        :disabled="!userId"
        @click="onConfirm">
        确定
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import {
  SPACE_ROLE,
  SPACE_ROLE_LABEL as spaceRoleOptions,
} from '@/core/constants/role';
import { differenceBy } from 'lodash';
import dialog from '@/view/mixins/dialog';
import UserService from '@/core/services/user.service';

export default {
  name: 'AddUserDialog',
  extends: dialog('添加用户'),
  props: {
    spaceId: { type: String, default: '' },
    orgId: { type: String, default: '' },
    allUsers: { type: Array, default: () => [] },
  },
  created() {
    this.loadAllUsers();
  },
  data() {
    const role = SPACE_ROLE.MEMBER;
    return {
      userId: '',
      role,
      spaceRoleOptions,
      checkPhoneNumber: false,
      options: [],
      users: [],
    };
  },
  methods: {
    loadAllUsers() {
      UserService.getOrgUsers(this.orgId).then(users => {
        const userList = differenceBy(users, this.allUsers, 'id');
        const options = userList.map(user => ({
          text: `${user.phone_number} ${
            user.username ? `(${user.username})` : ''
          }`,
          value: user.phone_number,
          username: user.username,
          id: user.id,
        }));
        this.users = users;
        this.options = options;
      });
    },

    onConfirm() {
      const { userId, role } = this;
      const user = this.users.find(x => x.id === userId);
      const params = { space_role: role };
      this.$emit('add-user', user, params);
      this.onClose();
    },

    // @overload
    dialogWillClose() {
      this.users = [];
      this.options = [];
      this.userId = '';
    },
  },
};
</script>
