<template>
  <dao-setting-layout>
    <template slot="layout-title">启动方式</template>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">
          <span>启动命令</span>
        </div>
        <div slot="content">
          <dao-input
            icon-inside
            type="text"
            v-model="_cmd"
            name="cmd"
            :message="veeErrors.first('cmd')"
            :status="veeErrors.has('cmd') ? 'error' : ''"
            data-vv-delay="500"
            v-validate="'shell_quota'"
            placeholder="默认会使用镜像里面的 entrypoint"
          ></dao-input>
        </div>
      </dao-setting-item>
      <dao-setting-item>
        <div slot="label">
          <span>参数</span>
        </div>
        <div slot="content">
          <dao-input
            icon-inside
            type="text"
            v-model="_args"
            name="args"
            :message="veeErrors.first('args')"
            :status="veeErrors.has('args') ? 'error' : ''"
            data-vv-delay="500"
            v-validate="'shell_quota'"
            placeholder="用空格隔开，默认会使用镜像里面的 cmd"
          ></dao-input>
        </div>
      </dao-setting-item>
    </dao-setting-section>
  </dao-setting-layout>
</template>

<script>
export default {
  name: 'CommandSection',

  inject: ['$validator'],

  props: {
    cmd: { type: String, default: '' },
    args: { type: String, default: '' },
  },

  computed: {
    _cmd: {
      get() {
        return this.cmd;
      },
      set(cmd) {
        this.$emit('update:cmd', cmd);
      },
    },

    _args: {
      get() {
        return this.args;
      },
      set(args) {
        this.$emit('update:args', args);
      },
    },
  },
};
</script>
