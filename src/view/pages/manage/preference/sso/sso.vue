<template>
  <dao-setting-layout>
    <div slot="layout-title">
      上汽通用汽车统一身份管理
    </div>

    <dao-setting-section>
      <div slot="label">名称</div>
      <div slot="content">
        <dao-input
          icon-inside
          name="name"
          data-vv-as="名称"
          v-validate="'required|max:20'"
          :message="veeErrors.first('name')"
          :status="veeErrors.has('name') ? 'error' : ''"
          v-model="ssoModel.name">
        </dao-input>
      </div>
    </dao-setting-section>

    <dao-setting-section>
      <template #label>登录 URL</template>
      <template #content>
        <dao-input
          icon-inside
          name="login_url"
          data-vv-as="登录 URL"
          v-validate="'required|url'"
          :message="veeErrors.first('login_url')"
          :status="veeErrors.has('login_url') ? 'error' : ''"
          v-model="ssoModel.login_url">
        </dao-input>
      </template>
    </dao-setting-section>

    <dao-setting-section>
      <template #label>登出 URL</template>
      <template #content>
        <dao-input
          icon-inside
          name="logout_url"
          data-vv-as="登出 URL"
          v-validate="'required|url'"
          :message="veeErrors.first('logout_url')"
          :status="veeErrors.has('logout_url') ? 'error' : ''"
          v-model="ssoModel.logout_url">
        </dao-input>
      </template>
    </dao-setting-section>

    <dao-setting-section>
      <template #label>仅通过 SSO 登录</template>
      <template #content>
        <dao-switch
          @change="onChange"
          name="sso-only"
          v-model="ssoOnly">
        </dao-switch>
      </template>
    </dao-setting-section>

    <template #footer>
      <save-button
        class="blue"
        text="保存"
        :saving="isSubmit"
        @click="onSubmit">
      </save-button>
    </template>

  </dao-setting-layout>
</template>

<script>
import { first, pick } from 'lodash';
import SSOService from '@/core/services/sso.service';

export default {
  name: 'SSODetail',

  data() {
    return {
      ssoModel: {},
      isSubmit: false,
      ssoOnly: false,
    };
  },

  created() {
    this.loadSSOInfo();
  },

  methods: {
    loadSSOInfo() {
      SSOService.getSSO().then(sso => {
        this.ssoOnly = !sso.enable_local_login;
      });

      SSOService.getIdentityProvider().then(providers => {
        this.ssoModel = pick(first(providers), [
          'id',
          'name',
          'login_url',
          'logout_url',
        ]);
      });
    },

    onChange() {
      SSOService.updateSSO({
        enable_local_login: !this.ssoOnly,
      });
    },

    onSubmit() {
      this.$validator.validateAll().then(valid => {
        if (valid) {
          this.isSubmit = true;
          if (this.ssoModel.id) {
            this.updateSSO();
          } else {
            this.createSSO();
          }
        }
      });
    },

    createSSO() {
      SSOService.createIdentityProvider(this.ssoModel)
        .then(() => {
          this.$noty.success('添加成功');
        })
        .catch(() => {
          this.$noty.error('添加第三方登录失败');
        })
        .finally(() => {
          this.isSubmit = false;
        });
    },

    updateSSO() {
      SSOService.updateIdentityProvider(this.ssoModel.id, this.ssoModel)
        .then(() => {
          this.$noty.success('修改成功');
        })
        .catch(() => {
          this.$noty.error('修改第三方登录失败');
        })
        .finally(() => {
          this.isSubmit = false;
        });
    },
  },
};
</script>
