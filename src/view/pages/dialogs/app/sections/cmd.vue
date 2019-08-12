<template>
  <dao-setting-layout>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">
          <span>启动命令</span>
        </div>
        <div slot="content">
          <dao-input
            type="text"
            icon-inside
            v-model.trim="cmd"
            name="cmd"
            :message="veeErrors.first('cmd')"
            :status="veeErrors.has('cmd') ? 'error' : ''"
            data-vv-delay="500"
            v-validate="'shell_quota'"
            placeholder="默认会使用镜像里面的 entrypoint">
          </dao-input>
        </div>
      </dao-setting-item>
      <dao-setting-item>
        <div slot="label">
          <span>参数</span>
        </div>
        <div slot="content">
          <dao-input
            type="text"
            icon-inside
            v-model.trim="args"
            name="args"
            :message="veeErrors.first('args')"
            :status="veeErrors.has('args') ? 'error' : ''"
            data-vv-delay="500"
            v-validate="'shell_quota'"
            placeholder="用空格隔开，默认会使用镜像里面的 cmd">
          </dao-input>
        </div>
      </dao-setting-item>
    </dao-setting-section>
  </dao-setting-layout>
</template>

<script>
import { cloneDeep } from 'lodash';
import ShellQuote from 'shell-quote';

export default {
  name: 'SectionCmd',
  props: {
    containercmd: { type: Array, default: () => [] },
    containerparams: { type: Array, default: () => [] },
  },
  data() {
    return {
      editEnvs: [],
      isValid: true,
      cmd: '',
      args: '',
    };
  },
  watch: {
    envs: {
      immediate: true,
      handler() {
        this.editEnvs = cloneDeep(this.envs);
      },
    },
    containercmd: {
      immediate: true,
      handler(containercmd) {
        this.cmd = containercmd.join(' ');
      },
    },
    containerparams: {
      immediate: true,
      handler(containerparams) {
        this.args = containerparams.join(' ');
      },
    },
  },
  methods: {
    validate() {
      return !this.veeErrors.any();
    },

    providePartialModel() {
      const { cmd = '', args = '' } = this;
      const containercmd = ShellQuote.parse(cmd) || [];
      const containerparams = ShellQuote.parse(args) || [];
      return {
        containercmd,
        containerparams,
      };
    },
  },
};
</script>
