<template>
  <dao-dialog
    class="add-broker-dialog"
    header="添加 Broker"
    :visible.sync="isShow"
    @before-open="init">
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">名称</div>
        <div slot="content">
          <dao-input
            icon-inside
            type="text"
            name="name"
            data-vv-as="名称"
            placeholder="例: MySql-broker"
            :message="veeErrors.first('name')"
            :status="veeErrors.has('name') ? 'error' : ''"
            v-validate="{
              required: true,
              dns_1123_sub_domain: true,
              max: nameValidation.maxlength
            }"
            v-model="brokerModel.name">
          </dao-input>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">地址</div>
        <div slot="content">
          <dao-input
            icon-inside
            type="text"
            name="url"
            data-vv-as="地址"
            :message="veeErrors.first('url')"
            :status="veeErrors.has('url') ? 'error' : ''"
            v-validate="'required|url'"
            v-model="brokerModel.url">
          </dao-input>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">授权信息</div>
        <template slot="content">
          <dao-radio-group
            name="authType"
            class="radio-inline">
            <dao-radio
              label="none"
              v-model="authType">无
            </dao-radio>
            <dao-radio
              label="account"
              v-model="authType"
              class="m-l-sm">密码登录
            </dao-radio>
            <dao-radio
              label="token"
              v-model="authType"
              class="m-l-sm">TOKEN登录
            </dao-radio>
          </dao-radio-group>
          <template v-if="authType === 'token'">
            <dao-input
              icon-inside
              type="text"
              name="token"
              data-vv-as="TOKEN"
              :message="veeErrors.first('token')"
              :status="veeErrors.has('token') ? 'error' : ''"
              v-validate="'required'"
              v-model="brokerModel.token">
            </dao-input>
          </template>
          <div
            class="account-group"
            v-if="authType === 'account'">
            <div class="input-group">
              <span class="input-label">用户名</span>
              <dao-input
                block
                icon-inside
                type="text"
                name="userName"
                data-vv-as="用户名"
                :message="veeErrors.first('userName')"
                :status="veeErrors.has('userName') ? 'error' : ''"
                v-validate="'required|max:25'"
                v-model="brokerModel.userName">
              </dao-input>
            </div>
            <div class="input-group">
              <span class="input-label">密码</span>
              <dao-input
                block
                icon-inside
                type="text"
                name="password"
                data-vv-as="密码"
                :message="veeErrors.first('password')"
                :status="veeErrors.has('password') ? 'error' : ''"
                v-validate="'required|max:25'"
                v-model="brokerModel.password">
              </dao-input>
            </div>
          </div>
        </template>
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
        :disabled="formInvalidate"
        @click="onConfirm">
        添加
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import { DNS1123_SUBDOMAIN_VALIDATION } from '@/core/constants/resource';
import BrokerService from '@/core/services/broker.service';

export default {
  name: 'AddBrokerDialog',

  props: {
    visible: Boolean,
    zoneId: String,
    model: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      authType: 'none',
      brokerModel: {},
      nameValidation: DNS1123_SUBDOMAIN_VALIDATION,
    };
  },

  methods: {
    init() {
      this.brokerModel = { ...this.brokerModel, ...this.model };
    },

    async onConfirm() {
      const { authType } = this;
      if (authType === 'account' || authType === 'none') {
        delete this.brokerModel.token;
      } else if (authType === 'token' || authType === 'none') {
        delete this.brokerModel.userName;
        delete this.brokerModel.password;
      }

      await BrokerService.addBroker(this.zoneId, this.brokerModel)
        .then(() => {
          this.$noty.success('添加成功');
          this.onClose(true);
        })
        .catch();
    },

    onClose(refresh) {
      this.$emit('close', refresh);
      this.brokerModel = {};
    },
  },

  computed: {
    isShow: {
      set(val) {
        this.$emit('close', val);
      },
      get() {
        return this.visible;
      },
    },

    formInvalidate() {
      const {
        name, url, userName, password, token,
      } = this.brokerModel;
      let valid = true;
      if (this.authType === 'account') {
        valid = valid && userName && password;
      } else if (this.authType === 'token') {
        valid = valid && token;
      }
      valid = valid && name && url;
      return !valid || this.veeErrors.any();
    },
  },
};
</script>

<style lang="scss">
.add-broker-dialog {
  .dao-setting-content {
    :first-child {
      &.radio-inline {
        margin: 0;
      }
    }
  }

  .radio-inline {
    display: flex;

    .m-l-sm {
      margin-left: 15px;
    }
  }

  .account-group {
    display: flex;
    justify-content: space-between;
    border: 1px solid #e6e9ef;
    border-radius: 4px;
    padding: 10px;
    font-size: 13px;
    color: #9ba3af;
    line-height: 14px;
    background: #fbfcfc;
  }

  .input-group {
    flex-basis: calc(50% - 5px);

    .input-label {
      display: block;
      margin-bottom: 5px;
    }
  }
}
</style>
