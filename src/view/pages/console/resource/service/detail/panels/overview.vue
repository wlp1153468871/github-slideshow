<template>
  <div class="row">
    <div class="col-md-12">
      <div class="panel-resource">
        <h3>基本信息</h3>
        <div class="panel-resource-content content-bordered">
          <dl class="dl-horizontal dl-bordered">
            <div class="dl-item">
              <dt>Selectors:</dt>
              <dd>
                <span v-if="!service.spec.selector"><em>none</em></span>
                <span
                  v-for="(selectorValue, selectorLabel, index) in service.spec.selector"
                  :key="selectorLabel">
                  {{selectorLabel}}={{selectorValue}}
                  <template v-if="index !== size(service.spec.selector.length)">,&nbsp;</template>
                </span>
              </dd>
            </div>
            <div class="dl-item">
              <dt>Type:</dt>
              <dd>{{service.spec.type}}</dd>
            </div>
            <div class="dl-item">
              <dt>IP:</dt>
              <dd>{{service.spec.clusterIP}}</dd>
            </div>
            <div class="dl-item">
              <dt>Hostname:</dt>
              <dd>
                {{service.metadata.name}}.{{service.metadata.namespace}}.svc
                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  content="This address is only resolvable from within the cluster.">
                  <i class="el-icon-info color-info" slot="reference"></i>
                </el-popover>
              </dd>
            </div>
            <div v-if="service.spec.externalName" class="dl-item">
              <dt>External Hostname:</dt>
              <dd>{{service.spec.externalName}}</dd>
            </div>
            <div class="dl-item">
              <dt>Session affinity:</dt>
              <dd>{{service.spec.sessionAffinity}}</dd>
            </div>
            <div
              v-if="serviceHasIngress"
              class="dl-item">
              <dt>Ingress Points:</dt>
              <dd>
                <span
                  v-for="(ingress, index) in service.status.loadBalancer.ingress"
                  :key="index">
                  {{ingress.ip}},
                </span>
              </dd>
            </div>
            <div class="dl-item" v-if="service.spec.externalIPs && service.spec.externalIPs.length">
              <dt>External IPs:</dt>
              <dd>
                <span
                  v-for="(externalIP, index) in service.spec.externalIPs"
                  :key="index">
                  {{externalIP}},
                </span>
              </dd>
            </div>
            <div
              v-if="routes.length"
              class="dl-item">
              <dt>Routes:</dt>
              <dd>
                <router-link
                  v-if="$can('create')"
                  :to="{ name: 'deploy.routes', query: { service: service.metadata.name} }">
                  创建 Route
                </router-link>
                <template v-else>
                  暂无
                </template>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
    <div
      class="col-md-12"
      style="margin-top: 20px;"
    >
      <div class="panel-resource">
        <h3>流量</h3>
        <div class="panel-resource-content">
          <traffic-route
            v-if="routes.length"
            :service="service"
            :routes="routes"
          >
          </traffic-route>

          <traffic-ingress
            v-else
            :service="service"
            :ingress-list="ingresses"
          >
          </traffic-ingress>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { size } from 'lodash';
import hashSizeFilter from '@/view/filters/hash-size.filter';
import TrafficRoute from '../tables/traffic-route';
import TrafficIngress from '../tables/traffic-ingress';

export default {
  name: 'service-overview-panel',

  props: {
    service: { type: Object, default: () => ({}) },
    routes: { type: Array, default: () => [] },
    ingresses: { type: Array, default: () => [] },
  },

  components: {
    TrafficRoute,
    TrafficIngress,
  },

  computed: {
    serviceHasIngress() {
      return (
        this.service.status.loadBalancer.ingress &&
        this.service.status.loadBalancer.ingress.length
      );
    },
  },

  methods: {
    hashSizeFilter,
    size,
  },
};
</script>

<style lang="scss">
</style>
