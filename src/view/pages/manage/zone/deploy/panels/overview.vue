<template>
  <div class="container panel-overview">
    <dao-setting-layout>
      <template slot="layout-title">可用区{{ operationLabel }}确认</template>
      <template v-for="(item, index) in info">
        <dao-setting-section
          v-if="item.value"
          :key="index">
          <dao-setting-item>
            <template #label>{{item.name}}</template>
            <template #content>{{item.value}}</template>
          </dao-setting-item>
        </dao-setting-section>
      </template>

      <dao-setting-section key="router-config">
        <dao-setting-item>
          <template #label>集群域名配置</template>
          <template #content>
            <table class="dao-table row">
              <thead>
              <tr>
                <th>名称</th>
                <th>Key</th>
                <th>标签</th>
                <th>域名</th>
              </tr>
              </thead>
              <tbody>
              <tr
                v-for="row in zone.router_config"
                :key="row.key">
                <td>{{row.title}}</td>
                <td>{{row.key}}</td>
                <td>{{row.label}}</td>
                <td>{{row.domain}}</td>
              </tr>
              </tbody>
            </table>
          </template>
        </dao-setting-item>
      </dao-setting-section>
    </dao-setting-layout>
  </div>
</template>

<script>
import { get as getValue } from 'lodash';

export default {
  name: 'OverviewPanel',

  props: {
    zone: { type: Object, default: () => ({}) },
    operationLabel: { type: String },
  },

  computed: {
    info() {
      return [
        {
          name: '区域',
          value: this.zone.area_name,
        },
        {
          name: '环境',
          value: this.zone.env_name,
        },
        {
          name: '集群地址',
          value: this.zone.clusterUrl,
        },
        {
          name: 'ES 地址',
          value: getValue(this.zone, 'es.esUrl'),
        },
        {
          name: '镜像仓库地址',
          value: getValue(this.zone, 'registry.url'),
        },
        {
          name: 'Grafana 地址',
          value: getValue(this.zone, 'grafana.url'),
        },
      ];
    },
  },
};
</script>
