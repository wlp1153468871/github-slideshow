<template>
  <div>
    <dao-setting-layout>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">用户名</div>
          <div slot="content">
            {{ user.username }}
          </div>
        </dao-setting-item>
      </dao-setting-section>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">用户授权</div>
          <div slot="content">
            {{ user.platform_role | platform_role }}
          </div>
        </dao-setting-item>
      </dao-setting-section>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">电子邮箱</div>
          <div slot="content">
            <dao-editable-input
              v-model="editData.email"
              placeholder="例：address@email.com"
              save-btn-content="保存"
              icon-inside
              :message="validate.email.message"
              :status="validate.email.status"
              :edit-state="false"
              :on-check="isValidEmail"
              :on-success="updateEmail">
            </dao-editable-input>
          </div>
        </dao-setting-item>
      </dao-setting-section>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">手机号</div>
          <div slot="content">
            <dao-editable-input
              v-model="editData.phone_number"
              placeholder="例：18012345678"
              save-btn-content="保存"
              icon-inside
              :message="validate.phone.message"
              :status="validate.phone.status"
              :edit-state="false"
              :on-check="isValidPhone"
              :on-success="updatePhone">
            </dao-editable-input>
          </div>
        </dao-setting-item>
      </dao-setting-section>
      <dao-setting-section v-if="isLocalAccount">
        <dao-setting-item>
          <div slot="label">登录密码</div>
          <div slot="content">
            <button class="dao-btn blue" @click="openUpdatePwdDialog()">
              修改密码
            </button>
          </div>
        </dao-setting-item>
      </dao-setting-section>
    </dao-setting-layout>

    <!-- dialogs start -->
    <update-pwd-dialog
      ref="updatePwdDialog"
      @update="updatePwd"
      :visible="dialogConfigs.updatePwd.visible"
      @close="dialogConfigs.updatePwd.visible = false">
    </update-pwd-dialog>
    <!-- dialogs end -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import AuthService from '@/core/services/auth.service';
import UserService from '@/core/services/user.service';
import isEmail from '@/core/utils/is-email';
import isPhone from '@/core/utils/is-phone';
// dialogs
import UpdatePwdDialog from '@/view/pages/dialogs/profile/update-pwd';

export default {
  name: 'SelfPanel',

  components: {
    UpdatePwdDialog,
  },

  created() {
    this.loadUserInfo();
  },

  data() {
    return {
      user: {},
      editData: {},
      validate: {
        email: {
          message: '',
          status: '',
        },
        phone: {
          message: '',
          status: '',
        },
      },
      dialogConfigs: {
        updatePwd: { visible: false },
      },
    };
  },

  computed: {
    ...mapGetters(['isLocalAccount']),
  },

  methods: {
    loadUserInfo() {
      AuthService.getUserInfo().then(user => {
        this.user = user;
        this.editData = { ...user };
      });
    },

    updateUser(edited) {
      const user = Object.assign({}, this.user, edited);
      UserService.updateSelf(this.user.id, user)
        .then(() => {
          this.$noty.success('成功修改用户信息');
        })
        .catch(() => {
          this.$noty.error('修改用户信息失败，请稍后再试');
        });
    },

    isValidEmail() {
      const isValid = isEmail(this.editData.email);
      this.validate.email.status = isValid ? '' : 'error';
      this.validate.email.message = isValid ? '' : '请输入正确格式的电子邮件';
      return isValid;
    },

    isValidPhone() {
      const isValid = isPhone(this.editData.phone_number);
      this.validate.phone.status = isValid ? '' : 'error';
      this.validate.phone.message = isValid ? '' : '请输入正确格式的手机';
      return isValid;
    },

    updateEmail() {
      const { email } = this.editData;
      const user = { email };
      this.updateUser(user);
    },

    updatePhone() {
      const { phone_number } = this.editData;
      const user = { phone_number };
      this.updateUser(user);
    },

    openUpdatePwdDialog() {
      this.dialogConfigs.updatePwd.visible = true;
    },

    updatePwd({ oldpwd, newpwd }) {
      UserService.updateSelfPwd(this.user.id, oldpwd, newpwd)
        .then(() => {
          this.$noty.success('修改密码成功');
        })
        .finally(() => {
          this.$refs.updatePwdDialog.onClose();
        });
    },
  },
};
</script>
