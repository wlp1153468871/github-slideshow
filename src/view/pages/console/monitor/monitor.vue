<template>
  <div id="monitor">
    <resource-header :resource="resource"></resource-header>
    <div id="monitor-tabs">
      <el-tabs v-model="activeTab">
        <el-tab-pane
          label="容器"
          name="container"
        >
          <containers></containers>
        </el-tab-pane>
        <el-tab-pane
          lazy
          label="应用"
          name="app"
        >
          <applications></applications>
        </el-tab-pane>
        <el-tab-pane
          lazy
          label="服务"
          name="service"
        >
          <services></services>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Applications from './applications/applications.vue';
import Containers from './containers/containers.vue';
import Services from './services/services.vue';

export default {
  name: 'Monitor',

  props: {},

  data() {
    return {
      resource: {
        name: '监控中心',
        logo: '#icon_monitor-logo',
        links: [
          {
            text: '监控中心',
          },
        ],
      },
      activeTab: this.$route.query.tab || 'container',
    };
  },

  components: {
    Applications,
    Containers,
    Services,
  },
};
</script>

<style lang="scss">
@import './_monitor';
</style>
