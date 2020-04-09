<template>
  <dao-dialog
    :config="config"
    :visible.sync="isShow"
    :close-on-press-escape="false"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onCancel"
    @dao-dialog-confirm="onConfirm"
  >
    <dao-setting-layout>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">监控类型</div>
          <div slot="content">
            <dao-select>
              <dao-option>
                Java
              </dao-option>
            </dao-select>
          </div>
        </dao-setting-item>
      </dao-setting-section>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">端口号</div>
          <div slot="content">
            <dao-input
              icon-inside
              name="port"
              v-model="port"
              :message="veeErrors.first('port')"
              :status="veeErrors.has('port') ? 'error' : ''"
              v-validate="'required|port'"
              data-vv-as="端口"
              placeholder="端口号；例:80"
            >
            </dao-input>
          </div>
        </dao-setting-item>
      </dao-setting-section>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">用户名</div>
          <div slot="content">
            <dao-input
              v-model="username"
              placeholder="JMX Remote Username"
              name="username"
              type="text"
              autocomplete="off"
              icon-inside
              :message="veeErrors.first('username')"
              :status="veeErrors.has('username') ? 'error' : ''"
              data-vv-as="用户名"
            >
            </dao-input>
          </div>
        </dao-setting-item>
        <dao-setting-item>
          <div slot="label">密码</div>
          <div slot="content">
            <dao-input
              icon-inside
              v-model="password"
              placeholder="JMX Remote Password"
              name="password"
              type="password"
              autocomplete="off"
              :message="veeErrors.first('password')"
              :status="veeErrors.has('password') ? 'error' : ''"
              data-vv-as="密码"
            >
            </dao-input>
          </div>
        </dao-setting-item>
      </dao-setting-section>
    </dao-setting-layout>
    <div slot="footer">
      <button class="dao-btn ghost" @click="onCancel">
        取消
      </button>
      <save-button class="blue" text="确定" :disabled="!isValidForm" @click="onConfirm">
      </save-button>
    </div>
  </dao-dialog>
</template>

<script>
import dialog from '@/view/mixins/dialog';

export default {
  name: 'AdvanceMonitor',

  extends: dialog('高级监控项'),

  props: {
    monitortype: { type: String, default: '' },
    monitorport: { type: Number, default: null },
    monitorname: { type: String, default: '' },
    monitorpassword: { type: String, default: '' },
  },

  data() {
    return {
      port: null,
      username: '',
      password: '',
    };
  },

  computed: {
    isValidForm() {
      return Boolean(this.port && !this.veeErrors.any());
    },
  },

  watch: {
    monitorport: {
      immediate: true,
      handler(val) {
        this.port = val;
      },
    },
    monitorname: {
      immediate: true,
      handler(val) {
        this.username = val;
      },
    },
    monitorpassword: {
      immediate: true,
      handler(val) {
        this.password = val;
      },
    },
  },

  methods: {
    onConfirm() {
      this.$emit('save', {
        port: this.port,
        username: this.username,
        password: this.password,
      });
      this.onClose();
    },

    dialogWillClose() {
      this.port = this.monitorport;
      this.username = this.monitorname;
      this.password = this.monitorpassword;
    },
  },
};
</script>
