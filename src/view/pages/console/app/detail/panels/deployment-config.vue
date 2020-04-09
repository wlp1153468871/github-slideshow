<template>
  <div class="app-deployment-panel">
    <dao-table-view :rows="deploymentConfigs" :config="tConfig"> </dao-table-view>
  </div>
</template>

<script>
import { get as getValue } from 'lodash';
import tableView from '@/view/mixins/table-view';

export default {
  name: 'DeploymentConfigPanel',

  extends: tableView('id', Infinity),

  props: {
    deploymentConfigs: { type: Array, default: () => [] },
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
            onClick: resource => {
              if (resource.kind === 'Deployment') {
                this.$router.push({
                  name: 'resource.deployments.detail',
                  params: { name: resource.metadata.name },
                });
              } else if (resource.kind === 'DeploymentConfig') {
                this.$router.push({
                  name: 'resource.deploymentconfigs.detail',
                  params: { name: resource.metadata.name },
                });
              }
            },
          },
        },
        {
          id: 'image',
          name: '镜像',
          value(_, deploymentConfig) {
            const containers = getValue(deploymentConfig, 'spec.template.spec.containers') || [];
            return containers
              .map(x => x.image)
              .filter(Boolean)
              .join();
          },
        },
        // { id: 'status', name: '状态' },
        {
          id: 'generation',
          name: '容器组数量',
          value(_, deploymentConfig) {
            const { spec, status } = deploymentConfig;
            return `${status.availableReplicas} / ${spec.replicas}`;
          },
        },
        {
          id: 'creationTimestamp',
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
