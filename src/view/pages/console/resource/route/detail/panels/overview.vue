<template>
  <div>
    <div class="resource-details">
      <div v-if="!route.status.ingress" class="route-status">
        <span class="h3">
          {{route | route_label(null, true)}}
        </span>
        <div class="meta">
          <status-icon :status="'Pending'"></status-icon>
          The route is not accepting traffic yet because it has not been admitted by a router.
        </div>
      </div>
      <div
        :key="index"
        v-for="(ingress, index) in route.status.ingress"
        class="route-status">
        <div class="h3">
          <span v-if="isWebRouteFilter(route)">
            {{ 'hostname' | translate }}:&nbsp;
            <a :href="route | route_web_url(ingress.host)" target="_blank">
              {{route | route_label(ingress.host, true)}}
              <svg class="icon">
                <use xlink:href="#icon_link"></use>
              </svg>
            </a>
          </span>
          <span v-if="!isWebRouteFilter(route)">
            {{route | route_label(ingress.host)}}
          </span>
        </div>
        <div class="meta">
          <span v-if="!admittedCondition(ingress)">
            负载均衡器 '{{ingress.routerName}}' 的准入状态未知
          </span>
          <span v-if="admittedCondition(ingress).status === 'True'">
            <status-icon :status="'Succeeded'"></status-icon>
            通过负载均衡器 '{{ingress.routerName}}' 暴露于
            <span>{{admittedCondition(ingress).lastTransitionTime | date_from(null, true)}}</span>
          </span>
          <span v-if="admittedCondition(ingress).status === 'False'">
            <status-icon :status="'Error'"></status-icon>
            负载均衡器 '{{ingress.routerName}}' 拒绝访问
          </span>
        </div>
        <!--TODO-->
        <!--<div
          v-if="showRouterHostnameAlert(ingress, admittedCondition(ingress))"
          class="mar-top-lg">
          <div class="alert alert-info">
            <span class="pficon pficon-info" aria-hidden="true"></span>
            The DNS admin should set up a CNAME from the route's hostname, {{ingress.host}},
            to the router's canonical hostname, {{ingress.routerCanonicalHostname}}.
          </div>
        </div>-->
      </div>
    </div>
    <div class="route-overview instance-overview">
      <div class="info-column">
        <!-- 基本信息 -->
        <div class="ins-setting-card">
          <div class="ins-card-title">
            基本信息
          </div>
          <div class="ins-card-body">
            <div
              class="ins-info-item"
              v-for="(value, key) in information.basic"
              :key="key">
            <span class="info-item-label text-lowercase">
              {{ key }}
            </span>
              <span class="info-item-content">
              {{ value }}
            </span>
            </div>
          </div>
        </div>
        <!-- 配置信息 -->
        <div class="ins-setting-card">
          <div class="ins-card-title">
            配置信息
          </div>
          <div class="ins-card-body">
            <div class="ins-info-item">
              <span class="info-item-label">
                访问路径
              </span>
              <span class="info-item-content">
                <span v-if="route.spec.path">{{route.spec.path}}</span>
                <span v-else><em>暂无</em></span>
              </span>
            </div>
            <div class="ins-info-item">
              <span class="info-item-label">
                {{route.spec.to.kind || 'Routes To'}}:
              </span>
              <span class="info-item-content">
                <template v-if="hasServiceBeenDeleted(route.spec.to.name)">
                  <router-link
                    :to="{ name: 'resource.service', params: { name: route.spec.to.name } }">
                  {{route.spec.to.name}}
                </router-link>
                </template>
                <template v-else>
                  <span>{{ route.spec.to.name }}</span>
                  <el-popover
                    placement="top-start"
                    width="300"
                    trigger="hover">
                    <span v-html="serviceDeletedMessage(route.spec.to.name)"></span>
                    <span slot="reference">
                      <svg class="icon" style="color: #f1483f; margin-left: 5px;">
                        <use xlink:href="#icon_close"></use>
                      </svg>
                    </span>
                  </el-popover>
                </template>
              </span>
            </div>
            <div class="ins-info-item" v-if="route.spec.port">
              <span class="info-item-label">
               Target Port
              </span>
              <span class="info-item-content">
                <span v-if="route.spec.port.targetPort">
                 {{route.spec.port.targetPort}}
                </span>
                <span v-if="!route.spec.port.targetPort"><em>any</em></span>
              </span>
            </div>
            <div v-if="helpBlock" class="help-block ins-info-item">
              This target port will route to
              &nbsp;{{route | route_target_port_mapping(services[route.spec.to.name])}}.
            </div>
          </div>
        </div>
        <!-- TLS 设置-->
        <div class="ins-setting-card">
          <div class="ins-card-title">
            TLS 设置
          </div>
          <div class="ins-card-body">
            <template v-if="route.spec && route.spec.tls">
              <div class="ins-info-item">
                <span class="info-item-label">
                  Termination Type
                </span>
                <span class="info-item-content">
                  {{route.spec.tls.termination | humanize_tls_termination }}
                </span>
              </div>
              <div class="ins-info-item">
                <span class="info-item-label">证书</span>
                <button
                  class="dao-btn btn-sm mini blue"
                  @click="showTLS(route.spec.tls.certificate)">
                  显示
                </button>
              </div>
              <div class="ins-info-item">
                <span class="info-item-label">私钥</span>
                <button
                  class="dao-btn btn-sm mini blue"
                  @click="showTLS(route.spec.tls.key)">
                  显示
                </button>
              </div>
              <div class="ins-info-item">
                <span class="info-item-label">CA证书</span>
                <button
                  class="dao-btn btn-sm mini blue"
                  @click="showTLS(route.spec.tls.caCertificate)">
                  显示
                </button>
              </div>
            </template>
            <div
              v-else
              class="ins-info-item">TLS is not enabled.
            </div>
          </div>
        </div>
      </div>

      <div class="detail-column">
        <div class="ins-setting-card">
          <div class="ins-card-title">
            <span>操作记录</span>
            <button
              class="dao-btn btn-sm blue mini"
              @click="$emit('change-tab', 'jobs')">
              查看更多 >
            </button>
          </div>
          <div class="ins-card-body">
            <event-list :jobs="jobs"></event-list>
          </div>
        </div>
      </div>

      <dao-dialog :visible.sync="visible" header="TLS 详情">
        <div class="tls-info">
          {{ selectedTLS }}
        </div>
      </dao-dialog>

    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { get as getValue } from 'lodash';
import isWebRouteFilter from '@/view/filters/resource/is-web-route.filter';
import routeIngressConditionFilter from '@/view/filters/resource/route-ingress-condition.filter';
import JobsPanel from './jobs';

export default {
  name: 'OverviewPanel',

  components: {
    JobsPanel,
  },

  props: {
    route: { type: Object, default: () => ({}) },
    information: {
      type: Object,
      default: () => {
        return {
          basic: {},
        };
      },
    },
    jobs: { type: Array, default: () => [] },
    services: { type: Object, default: () => [] },
  },

  computed: {
    helpBlock() {
      const { route } = this;
      if (!route.spec.port) return false;
      return (
        route.spec.port.targetPort &&
        route.spec.to.kind === 'Service' &&
        Vue.filter('route_target_port_mapping')(
          this.route,
          this.services[route.spec.to.name],
        )
      );
    },
  },

  data() {
    return {
      visible: false,
      selectedTLS: '',
    };
  },

  methods: {
    // Use an alert key that has the route UID, route host, and router
    // hostname. This will handle cases where the route is admitted by
    // multiple routers and we have more than one alert.
    routerHostnameAlertKey(ingress) {
      const uid = getValue(this.route, 'metadata.uid');
      return `router-host-${uid}-${ingress.host}-${
        ingress.routerCanonicalHostname
      }`;
    },

    // isCustomHost() {
    //   return annotation(this.route, 'openshift.io/host.generated') !== 'true';
    // },
    // Show the alert for admitted routes that have a custom host if
    // routerCanonicalHostname is set.
    // showRouterHostnameAlert(ingress, admittedCondition) {
    //   if (!this.isCustomHost) {
    //     return false;
    //   }
    //
    //   if (!ingress || !ingress.host || !ingress.routerCanonicalHostname) {
    //     return false;
    //   }
    //
    //   if (!admittedCondition || admittedCondition.status !== 'True') {
    //     return false;
    //   }
    //
    //   const alertKey = this.routerHostnameAlertKey(ingress);
    //   return !AlertMessageService.isAlertPermanentlyHidden(
    //     alertKey,
    //     this.space.name,
    //   );
    // },

    admittedCondition(ingress) {
      return this.routeIngressConditionFilter(ingress, 'Admitted') || {};
    },

    routeIngressConditionFilter,

    isWebRouteFilter,

    showTLS(data) {
      this.selectedTLS = data;
      this.visible = true;
    },

    hasServiceBeenDeleted(serviceName) {
      return !!getValue(this.services, serviceName);
    },

    serviceDeletedMessage(name) {
      return `Routes to service <em>${name}</em>, but service does not exist.`;
    },
  },
};
</script>

<style lang="scss">
.resource-details {
  margin-top: 0;
  margin-bottom: 16px;
  padding: 15px;
  color: #3d444f;
  font-size: 14px;
  font-weight: 400;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(204, 209, 217, 0.3);
  background-color: #fff;
  line-height: 1;
}

.route-status .h3 {
  margin-top: 0;
  margin-bottom: 5px;
}

.route-overview {
  display: flex;
  flex-direction: row;

  .tls-info {
    padding: 20px;
  }
}
</style>
