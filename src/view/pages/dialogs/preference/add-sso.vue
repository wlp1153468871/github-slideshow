<template>
  <dao-dialog
    header="添加第三方登录"
    :visible.sync="isShow"
    @before-open="init"
    @closed="destroyed"
  >
    <dao-setting-layout>
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
        <template #label>描述</template>
        <template #content>
          <dao-input
            icon-inside
            name="description"
            data-vv-as="描述"
            :message="veeErrors.first('description')"
            :status="veeErrors.has('description') ? 'error' : ''"
            v-model="ssoModel.description">
          </dao-input>
        </template>
      </dao-setting-section>
    </dao-setting-layout>

    <div slot="footer">
      <button
        class="dao-btn ghost"
        @click="isShow = false">
        取消
      </button>
      <save-button
        class="blue"
        :text="confirmText"
        :loading="loading"
        @click="onConfirm">
      </save-button>
    </div>
  </dao-dialog>
</template>

<script>
import SSOService from '@/core/services/sso.service';

export default {
  name: 'AddSSODialog',

  props: {
    visible: { type: Boolean },
    baseModel: { type: Object },
  },

  data() {
    return {
      ssoModel: {},
      loading: false,
    };
  },

  computed: {
    isShow: {
      set(val) {
        this.$emit('update:visible', val);
      },
      get() {
        return this.visible;
      },
    },

    isUpdate() {
      return !!this.ssoModel.id;
    },

    confirmText() {
      return this.isUpdate ? '更新' : '创建';
    },
  },

  methods: {
    init() {
      this.ssoModel = { ...this.ssoModel, ...this.baseModel };
    },

    destroyed() {
      this.ssoModel = {};
      this.$emit('update:baseModel', null);
    },

    onConfirm() {
      this.loading = true;
      this.$validator.validateAll().then(valid => {
        if (valid) {
          this.submit();
        }
      });
    },

    submit() {
      if (this.isUpdate) {
        this.updateSSO();
      } else {
        this.createSSO();
      }
    },

    createSSO() {
      SSOService.createIdentityProvider(this.ssoModel).then(() => {
        this.$noty.success('添加成功');
        this.close();
      });
    },

    updateSSO() {
      SSOService.updateIdentityProvider(this.ssoModel).then(() => {
        this.$noty.success('修改成功');
        this.close();
      });
    },

    close() {
      this.isShow = false;
      this.$emit('refresh');
    },
  },
};
</script>
