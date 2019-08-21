<template>
  <dao-table-view
    ref="tableView"
    :rows="services"
    :config="tConfig">
  </dao-table-view>
</template>

<script>
import tableView from '@/view/mixins/table-view';

export default {
  name: 'ServicePanel',

  extends: tableView('id', 10),

  props: {
    services: { type: Array, default: () => [] },
  },

  created() {
    this.initTableView();
  },

  methods: {
    initTableView() {
      this.setTableConfig({
        hideRefresh: true,
      });

      this.setTableProps([
        {
          id: 'name',
          name: '名称',
          value: 'metadata.name',
          sort: 'metadata.name',
          type: 'goto',
          other: {
            onClick: service => {
              this.$router.push({
                name: 'resource.services.detail',
                params: {
                  name: service.metadata.name,
                },
              });
            },
          },
        },
        {
          id: 'ip',
          name: '集群IP',
          value: 'spec.clusterIP',
          sort: 'spec.clusterIP',
        },
        {
          id: 'version',
          name: '接入点',
          value(_, service) {
            const { ports = [] } = service.spec;
            return ports
              .map(port => `${port.port} > ${port.targetPort}`)
              .join(';');
          },
        },
        {
          id: 'protocol',
          name: '协议',
          value(_, service) {
            const { ports = [] } = service.spec;
            return ports.map(port => port.protocol).join(';');
          },
        },
        {
          id: 'created_at',
          name: '创建时间',
          value: 'metadata.creationTimestamp',
          sort: 'metadata.creationTimestamp',
          filter: 'date',
        },
      ]);
    },
  },
};
</script>
