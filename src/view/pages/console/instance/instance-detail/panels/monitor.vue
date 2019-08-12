<template>
  <iframe
    v-if="url"
    class="monitor-frame"
    ref="iframe"
    :src="url"
    frameborder="0">
  </iframe>
</template>

<script>
export default {
  name: 'MonitorPanel',
  props: {
    instanceId: { type: String, default: '' },
    url: { type: String, default: '' },
  },
  data() {
    return {
    };
  },
  beforeDestroy() {
    if (this.monitor) {
      this.monitor.destroy();
    }
  },
  methods: {
    clearMonitor(type) {
      this.monitorInfo[type] = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.monitor-frame {
  width: 100%;
  height: calc(100vh - 151px);
}
</style>
