<template>
  <dao-dialog
    :config="config"
    :visible.sync="isShow"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose"
    @dao-dialog-confirm="onConfirm"
  >
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">用户名</div>
        <div slot="content">
          <dao-input
            v-model="user.username"
            placeholder="新成员用户名"
            name="realname"
            type="text"
            v-validate="'required|namespace_code|min:2|max:20'"
            icon-inside
            :message="veeErrors.first('realname')"
            :status="veeErrors.has('realname') ? 'error' : ''"
            data-vv-as="姓名"
          >
          </dao-input>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">邮箱</div>
        <div slot="content">
          <dao-input
            v-model="user.email"
            placeholder="新成员电子邮件"
            name="email"
            type="text"
            icon-inside
            :message="veeErrors.first('email')"
            :status="veeErrors.has('email') ? 'error' : ''"
            v-validate="'required|email'"
            data-vv-as="邮箱"
          >
          </dao-input>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">手机</div>
        <div slot="content">
          <dao-input
            v-model="user.phone"
            placeholder="新成员手机号"
            name="phone"
            type="text"
            icon-inside
            :message="veeErrors.first('phone')"
            :status="veeErrors.has('phone') ? 'error' : ''"
            v-validate="'required|real_phone'"
            data-vv-as="手机"
          >
          </dao-input>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">平台权限</div>
        <div slot="content">
          <dao-select v-model="role" placeholder="请选择">
            <!-- <dao-option
              :value="PLATFORM_ROLE.MEMBER"
              :label="PLATFORM_ROLE.MEMBER | platform_role">
            </dao-option>
            <dao-option
              :value="PLATFORM_ROLE.ADMIN"
              :label="PLATFORM_ROLE.ADMIN | platform_role">
            </dao-option> -->
            <dao-option v-for="(r, index) in platformroles" :key="index" :value="r" :label="r.name">
            </dao-option>
          </dao-select>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">密码</div>
        <div slot="content">
          <dao-input
            v-model="user.pwd"
            placeholder="新密码"
            name="pwd"
            type="password"
            autocomplete="new-password"
            v-validate="'exclude_spaces|required|min:5'"
            icon-inside
            :message="veeErrors.first('pwd')"
            :status="veeErrors.has('pwd') ? 'error' : ''"
            data-vv-as="新密码"
          >
          </dao-input>
        </div>
      </dao-setting-item>
      <dao-setting-item>
        <div slot="label">确认密码</div>
        <div slot="content">
          <dao-input
            v-model="user.confirmpwd"
            placeholder="确认密码"
            name="confirmpwd"
            type="password"
            autocomplete="new-password"
            v-validate="{ exclude_spaces: true, required: true, min: 5, equal_to: user.pwd }"
            icon-inside
            :message="veeErrors.first('confirmpwd')"
            :status="veeErrors.has('confirmpwd') ? 'error' : ''"
            data-vv-as="确认密码"
          >
          </dao-input>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">单位名称</div>
        <div slot="content">
          <dao-input
            v-model="user.company_name"
            placeholder="单位名称"
            type="text"
            name="company_name"
            v-validate="'max:100'"
            icon-inside
            :message="veeErrors.first('company_name')"
            :status="veeErrors.has('company_name') ? 'error' : ''"
          >
          </dao-input>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <div slot="footer">
      <button class="dao-btn ghost" @click="onClose">
        取消
      </button>
      <save-button
        class="blue"
        text="创建"
        :saving="loading"
        :disabled="loading || isValidForm"
        @click="onConfirm()"
      >
      </save-button>
    </div>
  </dao-dialog>
</template>

<script>
// import { PLATFORM_ROLE } from '@/core/constants/role';
import dialog from '@/view/mixins/dialog';

export default {
  name: 'CreateUserDialog',
  extends: dialog('创建用户'),
  props: {
    loading: { type: Boolean, default: false },
    platformroles: [Object, Array],
  },
  data() {
    // const role = PLATFORM_ROLE.MEMBER;
    return {
      // PLATFORM_ROLE,
      role: '',
      user: {
        username: '',
        email: '',
        pwd: '',
        confirmpwd: '',
        phone: '',
        company_name: '',
      },
    };
  },
  computed: {
    isValidForm() {
      return (
        this.user.username === '' ||
        this.user.email === '' ||
        this.role === '' ||
        this.user.pwd === '' ||
        this.user.confirmpwd === '' ||
        this.user.phone === '' ||
        this.veeErrors.any()
      );
    },
  },
  methods: {
    onConfirm() {
      if (!this.loading) {
        const isNewUser = true;
        this.$emit('create', this.user, this.role, isNewUser);
      }
    },

    dialogWillClose() {
      // const role = PLATFORM_ROLE.MEMBER;
      this.user = {
        username: '',
        email: '',
        pwd: '',
        confirmpwd: '',
        phone: '',
        company_name: '',
      };
      this.role = '';
    },
  },
};
</script>
