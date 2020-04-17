<template>
  <dao-dialog
    :config="config"
    :visible.sync="isShow"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose"
    @dao-dialog-confirm="onConfirm"
  >
    <form>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">旧密码</div>
          <div slot="content">
            <dao-input
              v-model="oldpwd"
              placeholder="旧密码"
              name="oldpwd"
              type="password"
              autocomplete="current-password"
              v-validate="'exclude_spaces|required|min:5'"
              icon-inside
              :message="veeErrors.first('oldpwd')"
              :status="veeErrors.has('oldpwd') ? 'error' : ''"
              data-vv-as="原密码"
            >
            </dao-input>
          </div>
        </dao-setting-item>
      </dao-setting-section>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">新密码</div>
          <div slot="content">
            <dao-input
              v-model="newpwd"
              placeholder="新密码"
              name="newpwd"
              type="password"
              autocomplete="new-password"
              v-validate="{ exclude_spaces: true, required: true, min: 5, different_from: oldpwd }"
              icon-inside
              :message="veeErrors.first('newpwd')"
              :status="veeErrors.has('newpwd') ? 'error' : ''"
              data-vv-as="新密码"
            >
            </dao-input>
          </div>
        </dao-setting-item>
      </dao-setting-section>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">确认密码</div>
          <div slot="content">
            <dao-input
              v-model="confirmpwd"
              placeholder="确认密码"
              name="confirmpwd"
              type="password"
              autocomplete="new-password"
              v-validate="{ exclude_spaces: true, required: true, min: 5, equal_to: newpwd }"
              icon-inside
              :message="veeErrors.first('confirmpwd')"
              :status="veeErrors.has('confirmpwd') ? 'error' : ''"
              data-vv-as="确认密码"
            >
            </dao-input>
          </div>
        </dao-setting-item>
      </dao-setting-section>
    </form>
    <div slot="footer">
      <button class="dao-btn ghost" @click="onClose">
        取消
      </button>
      <button class="dao-btn blue" :disabled="isValidForm" @click="onConfirm">
        确定
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import dialog from '@/view/mixins/dialog';

export default {
  name: 'UpdatePwdDialog',
  extends: dialog('修改登录密码'),
  data() {
    return {
      oldpwd: '',
      newpwd: '',
      confirmpwd: '',
    };
  },
  computed: {
    isValidForm() {
      return (
        this.oldpwd === '' || this.newpwd === '' || this.confirmpwd === '' || this.veeErrors.any()
      );
    },
  },
  methods: {
    onConfirm() {
      this.$emit('update', {
        oldpwd: this.oldpwd,
        newpwd: this.newpwd,
      });
    },

    dialogWillClose() {
      this.oldpwd = '';
      this.newpwd = '';
      this.confirmpwd = '';
    },
  },
};
</script>
