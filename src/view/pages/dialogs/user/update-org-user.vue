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
          <dao-select placeholder="请选择" v-model="role">
            <dao-option v-for="(r, index) in roles" :key="index" :value="r" :label="r.name">
            </dao-option>
          </dao-select>
        </div>
      </dao-setting-item>
      <el-alert
        v-if="isManageView ? false : user.username === userName && isOrganizationAdmin"
        style="margin-top: 15px;"
        title="请注意！您具有租户管理权限，请谨慎操作防止降级。"
        type="warning"
        show-icon
      >
      </el-alert>
    </dao-setting-section>

    <div slot="footer">
      <button class="dao-btn ghost" @click="onClose">
        取消
      </button>
      <button class="dao-btn blue" :disabled="!isValidForm" @click="onConfirm">
        确定
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import dialog from '@/view/mixins/dialog';

export default {
  name: 'UpdateOrgUserDialog',
  extends: dialog('修改用户权限'),
  props: {
    user: { type: Object, default: () => ({}) },
    // userRole: { type: String, default: '' },
    roles: { type: Array, default: () => [] },
  },
  data() {
    return {
      role: '',
    };
  },
  watch: {
    userRole: {
      immediate: true,
      handler(userRole) {
        this.role = userRole;
      },
    },
  },
  computed: {
    isValidForm() {
      return this.role !== this.userRole;
    },
    ...mapState(['isManageView']),
    ...mapGetters(['userName', 'isOrganizationAdmin']),
  },
  methods: {
    init() {
      if (this.user.roles) {
        const [role] = this.user.roles;
        this.role = role;
      } else {
        const [role] = this.roles.filter(r => r.name === '无权限');
        this.role = role;
      }
    },

    onConfirm() {
      // this.$emit('update', this.role);
      // 之前传的role 管理员对应的 organization_admin
      this.$emit('update', this.role);
      this.onClose();
    },
  },
};
</script>
