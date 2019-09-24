import ApplicationService from '@/core/services/application.service';
import DeploymentResourceService from '@/core/services/deployment.resource.service';
import DeploymentConfigResourceService from '@/core/services/deployment-config.resource.service';
import StatefulSetService from '@/core/services/stateful-set.service.ts';
import { mapState } from 'vuex';

import { MONITOR_KIND, MONITOR_TIME_MAP } from '@/core/constants/constants';
import { pick } from 'lodash';

export default {
  data() {
    const timeRanges = Object.keys(MONITOR_TIME_MAP);
    return {
      loadings: {
        iframe: false,
      },
      timeRanges,
      timeRange: timeRanges[0],
    };
  },
  computed: {
    ...mapState(['space', 'zone']),
  },
  methods: {
    setDefaultFilterValue(list, filterName) {
      this.filters[filterName] = list[0] || { name: '' };
    },
    // app= 'all'
    async fetchInstancesBasedKind(kind = MONITOR_KIND.DEPLOYMENT_CONFIG) {
      let list;
      switch (kind) {
        case MONITOR_KIND.DEPLOYMENT:
          list = await DeploymentResourceService.list(this.space.id, this.zone.id);
          break;
        case MONITOR_KIND.STATEFUL_SET:
          list = await StatefulSetService.list(this.space.id, this.zone.id);
          break;
        case MONITOR_KIND.DEPLOYMENT_CONFIG:
          list = await DeploymentConfigResourceService.list(this.space.id, this.zone.id);
          break;
        default:
      }
      return list.items
        .map(({ metadata: meta }) => ({ name: meta.name, id: meta.uid, kind }));
    },
    filterInstances(instances, kind) {
      return instances.filter(instance => instance.kind === kind)
        .map(instance => pick(instance, ['name', 'id']));
    },
    async getPods(instanceName) {
      const pods = await ApplicationService.getInstancePod(
        this.space.id,
        this.zone.id,
        instanceName,
      );
      if (pods.length) {
        const podsMap = pods.map(pod => ({ name: pod }));
        if (pods.length > 1) {
          podsMap.unshift({ name: '全部' });
        }
        return podsMap;
      }
      return [];
    },
    setFilters(state) {
      this.loading = state;
    },
    clickFilterFrame(handler, loadingHandler = this.setFilters) {
      loadingHandler(true);
      try {
        return handler();
      } catch (e) {
        console.log(e);
        return false;
      } finally {
        loadingHandler(false);
      }
    },
    async fetchIframe() {
      // 取监控地址
      this.loadings.iframe = true;
      const params = {
        pod: this.filters.pod.name,
        name: this.filters.instance.name,
      };
      params.numberEx = this.filters.pod.name === '全部' ? this.pods.length - 1 : 1;
      const { url } = await this.getAppMonitor(params);
      this.url = url;
      this.loadings.iframe = false;
    },
    async updateInstanceReady() {
      if (!this.filters.app || this.filters.app.id === '') {
        // 取实例
        this.instances = await this.fetchInstancesBasedKind(this.filters.kind);
      } else {
        this.instances = this.filterInstances(
          (await this.fetchInstancesBasedApp()),
          this.filters.kind,
        );
      }
      this.setDefaultFilterValue(this.instances, 'instance');
    },
    async onClickKind() {
      await this.clickFilterFrame(async () => {
        await this.updateInstanceReady();
        // 取pod
        if (this.filters.instance.name) {
          this.pods = await this.getPods(this.filters.instance.name);
          this.setDefaultFilterValue(this.pods, 'pod');
          // 取监控地址
          if (this.filters.pod.name) {
            await this.fetchIframe();
          }
        } else {
          this.pods = [];
          this.setDefaultFilterValue(this.pods, 'pod');
        }
      });
    },
    async onClickInstance() {
      await this.clickFilterFrame(async () => {
        // 取pod
        this.pods = await this.getPods(this.filters.instance.name);
        this.setDefaultFilterValue(this.pods, 'pod');
        // 取监控地址
        if (this.filters.pod.name) {
          await this.fetchIframe();
        }
      });
    },
    async onClickPod() {
      await this.clickFilterFrame(async () => {
        await this.fetchIframe();
      });
    },
  },
};
