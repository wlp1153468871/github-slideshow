<template>
  <div class="app-deployment-panel">
    <!-- Deployment -->
    <dao-table-view
      :rows="deployments"
      :config="tConfig">
      <div slot="tool" class="dao-table-view-left-bar">
        <span class="table-title">Deployment</span>
      </div>
    </dao-table-view>

    <!-- Deployment Config -->
    <dao-table-view
      style="margin-top: 20px;"
      :rows="deploymentConfigs"
      :config="tConfig">
      <div slot="tool" class="dao-table-view-left-bar">
        <span class="table-title">Deployment Config</span>
      </div>
    </dao-table-view>
  </div>
</template>

<script>
import { get as getValue } from 'lodash';
import tableView from '@/view/mixins/table-view';

export default {
  name: 'DeploymentPanel',

  extends: tableView('id', Infinity),

  props: {
    deployments: { type: Array, default: () => [] },
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
                  name: 'resource.deployment',
                  params: { name: resource.metadata.name },
                });
              } else if (resource.kind === 'DeploymentConfig') {
                this.$router.push({
                  name: 'resource.deployment-config',
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
            const containers =
              getValue(deploymentConfig, 'spec.template.spec.containers') || [];
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

<style lang="scss">
.app-deployment-panel {
  .table-title {
    // because .dao-table-view-left-bar's height is 32px;
    line-height: 32px;
  }
}
</style>
