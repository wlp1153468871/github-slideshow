<template>
  <dao-dialog
    :config="config"
    :visible.sync="isShow"
    @before-open="init"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose"
  >
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
          <dao-select placeholder="无权限" v-model="role">
            <!-- <dao-option
              :value="PLATFORM_ROLE.ADMIN"
              :label="PLATFORM_ROLE.ADMIN | platform_role">
            </dao-option>
            <dao-option
              :disabled="user.username === 'admin'"
              :value="PLATFORM_ROLE.MEMBER"
              :label="PLATFORM_ROLE.MEMBER | platform_role">
            </dao-option> -->
            <dao-option
              v-for="(r, index) in platformroles"
              :key="index"
              :value="r"
              :label="r.name"
            ></dao-option>
          </dao-select>
        </div>
      </dao-setting-item>
    </dao-setting-section>

    <div slot="footer">
      <button class="dao-btn ghost" @click="onClose">
        取消
      </button>
      <button class="dao-btn blue" :disabled="formValidate" @click="onConfirm">
        确定
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import { PLATFORM_ROLE } from '@/core/constants/role';
import dialog from '@/view/mixins/dialog';

export default {
  name: 'UpdateUserDialog',
  extends: dialog('修改用户权限'),
  props: {
    user: { type: Object, default: () => ({}) },
    platformroles: [Object, Array],
  },
  data() {
    return {
      role: '',
      PLATFORM_ROLE,
    };
  },
  watch: {
    user: {
      immediate: true,
      handler() {
        this.role = this.user.platform_role;
      },
    },
  },
  computed: {
    formValidate() {
      return this.role === this.user.platform_role;
    },
  },
  methods: {
    onConfirm() {
      this.$emit(
        'update',
        {
          id: this.user.id,
          role: 'platform_admin',
        },
        this.role,
      );
    },
    init() {
      if (this.user.roles) {
        const [role] = this.user.roles;
        this.role = role;
      } else {
        const [role] = this.platformroles.filter(r => r.name === '无权限');
        this.role = role;
      }
    },
  },
};
</script>
