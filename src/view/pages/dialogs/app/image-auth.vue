<template>
  <dao-dialog
    :config="config"
    :visible.sync="isShow"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose"
    @dao-dialog-confirm="onConfirm"
  >
    <dao-setting-layout>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">用户名</div>
          <div slot="content">
            <dao-input
              v-model="username"
              placeholder="镜像授权用户名"
              name="name"
              type="text"
              autocomplete="off"
              v-validate="'required'"
              icon-inside
              :message="veeErrors.first('name')"
              :status="veeErrors.has('name') ? 'error' : ''"
              data-vv-as="用户名"
            >
            </dao-input>
          </div>
        </dao-setting-item>
      </dao-setting-section>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">密码</div>
          <div slot="content">
            <dao-input
              v-model="pwd"
              placeholder="密码"
              name="pwd"
              type="password"
              autocomplete="off"
              v-validate="'required'"
              icon-inside
              :message="veeErrors.first('pwd')"
              :status="veeErrors.has('pwd') ? 'error' : ''"
              data-vv-as="密码"
            >
            </dao-input>
          </div>
        </dao-setting-item>
      </dao-setting-section>
    </dao-setting-layout>
    <div class="error-message" v-if="errorMsg">
      {{ errorMsg }}
    </div>
    <div slot="footer">
      <button class="dao-btn ghost" @click="onClose">
        取消
      </button>
      <save-button
        class="blue"
        text="确定"
        :disabled="veeErrors.any()"
        :saving="loadings.tags"
        @click="onConfirm"
      >
      </save-button>
    </div>
  </dao-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import dialog from '@/view/mixins/dialog';
import UtilService from '@/core/services/util.service';

export default {
  name: 'ImageAuthDialog',

  extends: dialog('镜像授权'),

  props: {
    url: { type: String, default: '' },
  },

  data() {
    return {
      username: '',
      pwd: '',
      errorMsg: '',
      loadings: {
        tags: false,
      },
    };
  },

  computed: {
    ...mapGetters(['orgId', 'zoneId']),
  },

  methods: {
    onConfirm() {
      const { url, username, pwd } = this;
      this.loadings.tags = true;
      UtilService.getDockerImageTags(this.orgId, this.zoneId, url, username, pwd)
        .then(tags => {
          this.$emit('authorization', {
            tags,
            username,
            password: pwd,
          });
          this.onClose();
        })
        .catch(err => {
          if (err.status === 403) {
            this.errorMsg = '用户名或密码错误';
          }
        })
        .finally(() => {
          this.loadings.tags = false;
        });
    },

    dialogWillClose() {
      this.username = '';
      this.pwd = '';
      this.errorMsg = '';
    },
  },
};
</script>
