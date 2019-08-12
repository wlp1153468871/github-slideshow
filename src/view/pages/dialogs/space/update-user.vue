<template>
  <dao-dialog
    :config="config"
    :visible.sync="isShow"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose">
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">用户名</div>
        <div slot="content">
          <p>{{ user.username }}</p>
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
        :disabled="formValidate"
        @click="onConfirm">
        确定
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import dialog from '@/view/mixins/dialog';
import { SPACE_ROLE_LABEL as spaceRoleOptions } from '@/core/constants/role';

export default {
  name: 'UpdateUserDialog',
  extends: dialog('修改用户'),
  props: {
    user: { type: Object, default: () => ({}) },
    updateUser: { type: Function, default: () => ({}) },
  },
  data() {
    return {
      role: '',
      spaceRoleOptions,
    };
  },
  watch: {
    user: {
      immediate: true,
      handler() {
        this.role = this.user.space_role;
      },
    },
  },
  computed: {
    formValidate() {
      return this.role === this.user.space_role;
    },
  },
  methods: {
    onConfirm() {
      const user = Object.assign({}, this.user);
      user.space_role = this.role;

      this.updateUser(user).then(() => {
        this.onClose();
      });
    },
  },
};
</script>
