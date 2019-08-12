<template>
  <div class="monitor">
    <circle-loading v-if="loading"></circle-loading>
    <template v-else>
      <resource-header :resource="resource"></resource-header>
      <iframe
        v-if="url"
        class="monitor-frame"
        :src="url"
        frameborder="0">
      </iframe>
      <p v-else class="empty-message">暂无监控数据</p>
    </template>
  </div>
</template>

<script>
import GrafanaService from '@/core/services/grafana.service';

export default {
  name: 'Monitor',

  props: {},

  data() {
    return {
      url: '',
      loading: true,
      resource: {
        name: '监控中心',
        logo: '#icon_monitor-logo',
        links: [
          {
            text: '监控中心',
          },
        ],
      },
    };
  },

  created() {
    this.loading = true;
    GrafanaService.getLink()
      .then(res => {
        this.url = res.url;
      })
      .finally(() => {
        this.loading = false;
      });
  },
};
</script>

<style lang="scss">
.monitor {
  .empty-message {
    margin: 20px;
    padding: 40px;
    font-size: 16px;
    color: #9ba3af;
    text-align: center;
  }

  .monitor-frame {
    width: 100%;
    height: calc(100vh - 151px);
  }
}
</style>
