<template>
  <div class="dashboard">
    <circle-loading v-if="loading"></circle-loading>
    <template v-else>
      <template v-if="!hasData">
        <div class="empty-data">
          <img src="@/assets/images/dashboard.png" alt=""/>
          <p class="empty-title">这里空空如也~</p>
          <p class="empty-content">您还未创建任何实例。</p>
        </div>
      </template>
      <template v-if="hasData">
        <div class="row">
          <div class="col-md-6">
            <div class="panel">
              <div class="panel-header">
                <svg class="icon">
                  <use xlink:href="#icon_application"></use>
                </svg>
                <span class="panel-name">应用</span>
              </div>
              <div class="panel-content">
                <table>
                  <colgroup>
                    <col width="40%"/>
                    <col width="60%"/>
                  </colgroup>
                  <thead>
                  <tr>
                    <th>可用区</th>
                    <th>应用数</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(application, index) in applications" :key="index">
                    <td>{{ application.zone }}</td>
                    <td class="count">{{ application.count }}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="panel">
              <div class="panel-header">
                <svg class="icon">
                  <use xlink:href="#icon_service-category"></use>
                </svg>
                <span class="panel-name">服务</span>
              </div>
              <div class="panel-content">
                <table>
                  <colgroup>
                    <col width="40%"/>
                    <col width="60%"/>
                  </colgroup>
                  <thead>
                  <tr>
                    <th>可用区</th>
                    <th>服务实例数</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(instance, index) in instances" :key="index">
                    <td>{{ instance.zone }}</td>
                    <td class="count">{{ instance.count }}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="panel">
              <div class="panel-header">
                <svg class="icon">
                  <use xlink:href="#icon_pvc"></use>
                </svg>
                <span class="panel-name">存储</span>
              </div>
              <div class="panel-content">
                <table>
                  <colgroup>
                    <col width="40%"/>
                    <col width="60%"/>
                  </colgroup>
                  <thead>
                  <tr>
                    <th>可用区</th>
                    <th>PVC</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(pvc, index) in pvcs" :key="index">
                    <td>{{ pvc.zone }}</td>
                    <td class="count">{{ pvc.count }}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="panel">
              <div class="panel-header">
                <svg class="icon">
                  <use xlink:href="#icon_docker-image"></use>
                </svg>
                <span class="panel-name">镜像中心</span>
              </div>
              <div class="panel-content">
                <table>
                  <colgroup>
                    <col width="40%"/>
                    <col width="60%"/>
                  </colgroup>
                  <thead>
                  <tr>
                    <th>可用区</th>
                    <th>镜像数量</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(image, index) in images" :key="index">
                    <td>{{ image.zone }}</td>
                    <td class="count">{{ image.count }}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="panel">
              <div class="panel-header">
                <svg class="icon">
                  <use xlink:href="#icon_resource"></use>
                </svg>
                <span class="panel-name">资源对象</span>
              </div>
              <div class="panel-content">
                <table class="resource-table">
                  <colgroup>
                    <col width="15%"/>
                  </colgroup>
                  <thead>
                  <tr>
                    <th>可用区</th>
                    <th>Deployment</th>
                    <th>Stateful Set</th>
                    <th>Pod</th>
                    <th>Service</th>
                    <th>Route</th>
                    <th>PVC</th>
                    <th>Secret</th>
                    <th>Config Map</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(resource, index) in resources" :key="index">
                    <td>{{ resource.zone }}</td>
                    <td class="count">{{ resource.deploymentCount }}</td>
                    <td class="count">{{ resource.statefulSetCount }}</td>
                    <td class="count">{{ resource.podCount }}</td>
                    <td class="count">{{ resource.serviceCount }}</td>
                    <td class="count">{{ resource.routeCount }}</td>
                    <td class="count">{{ resource.pvcCount }}</td>
                    <td class="count">{{ resource.secretCount }}</td>
                    <td class="count">{{ resource.configMapCount }}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import { RESOURCE_TYPE } from '@/core/constants/resource';
import { mapState } from 'vuex';
import { find, isEmpty, toPairs, get as getValue } from 'lodash';
import DashboardService from '@/core/services/dashboard.service';

export default {
  name: 'dashboard',

  data() {
    return {
      applications: [],
      services: [],
      pvcs: [],
      images: [],
      resources: [],
      loading: true,
      hasData: false,
    };
  },

  computed: {
    ...mapState(['space']),
  },

  watch: {
    space: {
      immediate: true,
      handler(value) {
        const spaceId = getValue(value, 'id');
        if (!spaceId) return;
        this.loadDashboard(spaceId);
      },
    },
  },

  methods: {
    loadDashboard(spaceId) {
      this.loading = true;
      DashboardService.getDashboard(spaceId)
        .then(res => {
          this.hasData = !isEmpty('res');
          this.groupApplication(res.instances);
          this.groupInstance(res.instances);
          this.groupPVCs(res.instances);
          this.groupResource(res.instances);
          this.groupImages(res.images);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    groupApplication(res) {
      this.applications = [];
      Object.entries(res).forEach(([zone, instances]) => {
        const app =
          find(instances, {
            service_type: RESOURCE_TYPE.APPLICATION,
          }) || {};
        this.applications.push({
          zone,
          count: app.instanceCount || 0,
        });
      });
    },

    groupPVCs(res) {
      this.pvcs = [];
      Object.entries(res).forEach(([zone, instances]) => {
        const pvc =
          find(instances, { service_type: RESOURCE_TYPE.VOLUME }) || {};
        this.pvcs.push({
          zone,
          count: pvc.instanceCount || 0,
        });
      });
    },

    groupInstance(res) {
      this.instances = [];
      Object.entries(res).forEach(([zone, instances]) => {
        let count = 0;
        instances
          .filter(instance => instance.service_type === RESOURCE_TYPE.BROKER_SERVICE)
          .forEach(i => {
            count += i.instanceCount;
          });
        this.instances.push({
          zone,
          count,
        });
      });
    },

    groupResource(res) {
      this.resources = [];
      Object.entries(res).forEach(([zone, instances]) => {
        const { instanceCount: deploymentCount = 0 } =
          find(instances, {
            service_type: RESOURCE_TYPE.DEPLOYMENT,
          }) || {};
        const { instanceCount: deploymentConfigCount = 0 } =
          find(instances, {
            service_type: RESOURCE_TYPE.DEPLOYMENT_CONFIG,
          }) || {};
        const { instanceCount: statefulSetCount = 0 } =
          find(instances, {
            service_type: RESOURCE_TYPE.STATEFUL_SET,
          }) || {};
        const { instanceCount: podCount = 0 } =
          find(instances, {
            service_type: RESOURCE_TYPE.POD,
          }) || {};
        const { instanceCount: serviceCount = 0 } =
          find(instances, {
            service_type: RESOURCE_TYPE.SERVICE,
          }) || {};
        const { instanceCount: routeCount = 0 } =
          find(instances, {
            service_type: RESOURCE_TYPE.ROUTE,
          }) || {};
        const { instanceCount: pvcCount = 0 } =
          find(instances, {
            service_type: RESOURCE_TYPE.VOLUME,
          }) || {};
        const { instanceCount: secretCount = 0 } =
          find(instances, {
            service_type: RESOURCE_TYPE.SECRET,
          }) || {};
        const { instanceCount: configMapCount = 0 } =
          find(instances, {
            service_type: RESOURCE_TYPE.CONFIG_MAP,
          }) || {};
        this.resources.push({
          zone,
          deploymentCount: deploymentCount + deploymentConfigCount,
          statefulSetCount,
          podCount,
          serviceCount,
          routeCount,
          pvcCount,
          secretCount,
          configMapCount,
        });
      });
    },

    groupImages(res) {
      this.images = toPairs(res).map(([zone, count]) => {
        return {
          zone,
          count,
        };
      });
    },
  },
};
</script>

<style lang="scss" src="./_dashboard.scss">
</style>
