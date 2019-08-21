<template>
  <dao-table-view
    :rows="routes"
    :config="tConfig">
  </dao-table-view>
</template>

<script>
import tableView from '@/view/mixins/table-view';

export default {
  name: 'RoutePanel',

  extends: tableView('id', 10),

  props: {
    routes: { type: Array, default: () => [] },
  },

  created() {
    this.initTableView();
  },

  methods: {
    initTableView() {
      this.setTableConfig({
        hideRefresh: true,
      });

      this.setTableProps([{
        id: 'name',
        name: '名称',
        value: 'metadata.name',
        sort: 'metadata.name',
        type: 'goto',
        other: {
          onClick: route => {
            this.$router.push({
              name: 'resource.routes.detail',
              params: {
                name: route.metadata.name,
              },
            });
          },
        },
      }, {
        id: 'host',
        name: '域名',
        sort: 'spec.host',
        value: 'spec.host',
        type: 'goto',
        other: {
          onClick(route) {
            const { tls } = route.spec;
            const url = (tls ? 'https://' : 'http://') + route.spec.host;
            window.open(url, '_blank');
          },
        },
      }, {
        id: 'protocol',
        name: '协议',
        value(_, route) {
          const { tls } = route.spec;
          return tls ? 'HTTPS' : 'HTTP';
        },
      }, {
        id: 'creationTimestamp',
        name: '创建时间',
        value: 'metadata.creationTimestamp',
        sort: 'metadata.creationTimestamp',
        filter: 'date',
      }]);
    },
  },
};
</script>
