<template>
  <dao-setting-layout>
    <dao-setting-section>
      <dao-setting-item>
        <template slot="label">域名</template>
        <template slot="content">
          {{ host }}
        </template>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <template slot="label">端口</template>
        <template slot="content">
          <dao-input
            icon-inside
            name="port"
            v-model="editPort"
            :message="veeErrors.first('port')"
            :status="veeErrors.has('port') ? 'error' : ''"
            v-validate="'required|port'"
            placeholder="端口号；例:80">
          </dao-input>
        </template>
      </dao-setting-item>
    </dao-setting-section>
  </dao-setting-layout>
</template>

<script>
export default {
  name: 'LoadBalance',
  props: {
    host: { type: String, default: '' },
    port: { type: Number, default: 80 },
  },
  data() {
    return {
      editPort: 80,
    };
  },
  watch: {
    port: {
      immediate: true,
      handler(port) {
        this.editPort = port;
      },
    },
  },
  methods: {
    validate() {
      return !this.veeErrors.any();
    },

    providePartialModel() {
      return {
        containerport: Number(this.editPort),
      };
    },
  },
};
</script>
