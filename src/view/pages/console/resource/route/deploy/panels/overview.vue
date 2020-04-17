<!--Created by Max on 2018-12-26.-->
<template>
  <div class="container panel-overview">
    <dao-setting-layout>
      <template slot="layout-title">订购确认</template>
      <template v-for="(item, index) in info">
        <dao-setting-section :key="index" v-if="!item.invisible">
          <dao-setting-item>
            <div slot="label">{{ item.name }}</div>
            <p slot="content">{{ item.value }}</p>
          </dao-setting-item>
        </dao-setting-section>
      </template>
    </dao-setting-layout>
  </div>
</template>

<script>
import Vue from 'vue';
import { get as getValue } from 'lodash';
import { DEPLOYMENT_TYPE } from '@/core/constants/app';
import { mapState } from 'vuex';

export default {
  name: 'OverviewPanel',

  props: {
    route: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    ...mapState(['org', 'space', 'zone']),

    info() {
      return [
        {
          name: '项目信息',
          value: `租户：${this.org.name}，项目：${this.space.name}`,
        },
        {
          name: '区域／环境',
          value: `${this.zone.area_name} / ${this.zone.env_name}`,
        },
        {
          name: '名称',
          value: this.route.name,
        },
        {
          name: '访问域名',
          value: this.route.host,
        },
        {
          name: '访问路径',
          value: this.route.path || '-',
          invisible: this.route.secureRoute && this.route.tls.termination === 'passthrough',
        },
        {
          name: '当前 Service',
          value: getValue(this.route.backend, 'name', '-'),
        },
        {
          name: '端口',
          value: getValue(this.route, 'ports', '-'),
        },
        {
          name: '新版本 Service',
          value: getValue(this.route.alternateBackends, 'name', '-'),
          invisible: this.route.release_type === DEPLOYMENT_TYPE.DEFAULT,
        },
        {
          name: '流量分配策略',
          value: this.strategy,
        },
        {
          name: 'TLS Termination',
          value: Vue.filter('humanize_tls_termination')(
            getValue(this.route.tls, 'termination', '-'),
          ),
          invisible: !getValue(this.route, 'secureRoute'),
        },
      ];
    },

    strategy() {
      const type = this.route.release_type;
      const currentApp = getValue(this.route.backend, 'name', '无');
      const nextApp = getValue(this.route.alternateBackends, 'name', '无');
      const weight = getValue(this.route.backend, 'weight', 0);

      if (type === DEPLOYMENT_TYPE.BLUEGREEN) {
        return `百分比：${weight}%的流量路由到当前 Service ${currentApp}；${
          100 - weight
        }%流量路由到新版本 Service ${nextApp}`;
      }
      return `默认：全部流量路由到当前 Service ${currentApp} `;
    },
  },
};
</script>
