import { mapState } from 'vuex';

import PodService from '@/core/services/pod.service';
import DCService from '@/core/services/deployment-config.service';
import StatefulSetService from '@/core/services/stateful-set.service';
import DeploymentService from '@/core/services/deployment.resource.service';

import { MONITOR_KIND, MONITOR_TIME_MAP } from '@/core/constants/constants';
import MonitorSelector from '@/view/mixins/monitor-selector';

const FILTER_MAP = {
  ALL: '全部',
};
export default {
  data() {
    const kinds = Object.values(MONITOR_KIND);
    return {
      filters: {
        kind: kinds[0],
        instance: {
          name: '',
          id: '',
        },
        pod: {
          name: '',
        },
      },
      kinds,
      instances: [],
      pods: [],
      loading: false,
      url: '',
    };
  },
  computed: {
    ...mapState(['space', 'zone']),
    instancesExisted() {
      return this.instances.length && this.pods.length;
    },
  },
  async created() {
    await this.init();
  },
  methods: {
    async getPodMonitor({ instance, pod, numberEx }) {
      const { url } = await PodService.fetchContainerMonitorUrl({
        pod,
        instance,
        numberEx,
        from: encodeURIComponent(MONITOR_TIME_MAP[this.timeRange][0]),
        to: encodeURIComponent(MONITOR_TIME_MAP[this.timeRange][1]),
      });
      return url;
    },
    async init() {
      await this.clickFilterFrame(async () => {
        await this.updateInstanceReady();
        if (this.filters.instance.name) {
          await this.podsAndContainersReady();
          await this.iframeHandler();
        }
      });
    },
    async iframeHandler() {
      // 取监控地址
      if (this.filters.pod.name) {
        const params = { instance: this.filters.instance.name };
        if (this.filters.pod.name === FILTER_MAP.ALL) {
          Object.assign(params, { numberEx: this.pods.length - 1 });
        } else {
          Object.assign(params, { numberEx: 1, pod: this.filters.pod.name });
        }
        this.url = await this.getPodMonitor(params);
      }
    },
    async onClickPodBeforeContainer() {
      await this.clickFilterFrame(async () => {
        await this.iframeHandler();
      });
    },
    async onClickKind() {
      await this.clickFilterFrame(async () => {
        await this.updateInstanceReady();
        // 取pod
        if (this.filters.instance.name) {
          await this.podsAndContainersReady();
          await this.iframeHandler();
        } else {
          this.pods = [];
          this.setDefaultFilterValue(this.pods, 'pod');
        }
      });
    },
    async onClickInstance() {
      if (this.filters.instance.name) {
        await this.podsAndContainersReady();
        await this.iframeHandler();
      }
    },
    composePodsAndContainers({ originData: { items } }) {
      if (!items || !items.length) {
        return [];
      }
      const podsMap = items.map(item => {
        const {
          metadata: { name },
        } = item;
        return {
          name,
        };
      });
      if (podsMap.length > 1) {
        podsMap.unshift({ name: FILTER_MAP.ALL });
      }
      return podsMap;
    },
    async getAllPodsAndContainers() {
      let list;
      const {
        instance: { name },
      } = this.filters;
      switch (this.filters.kind) {
        case MONITOR_KIND.DEPLOYMENT:
          list = await DeploymentService.getPods(this.space.id, this.zone.id, name);
          break;
        case MONITOR_KIND.STATEFUL_SET:
          list = await StatefulSetService.getPodList(this.space.id, this.zone.id, name);
          break;
        case MONITOR_KIND.DEPLOYMENT_CONFIG:
          list = await DCService.getPodList(this.space.id, this.zone.id, name);
          break;
        default:
      }
      return list;
    },
    async podsAndContainersReady() {
      this.pods = this.composePodsAndContainers(await this.getAllPodsAndContainers());
      this.setDefaultFilterValue(this.pods, 'pod');
    },
    async onClickTimeRange() {
      await this.iframeHandler();
    },
  },
  mixins: [MonitorSelector],
};
