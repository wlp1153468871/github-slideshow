import ApplicationService from '@/core/services/application.service';

import { MONITOR_KIND_MAP, MONITOR_TIME_MAP } from '@/core/constants/constants';
import MonitorSelector from '@/view/mixins/monitor-selector';

export default {
  data() {
    return {
      applications: [],
      instances: [],
      pods: [],
      loading: false,
      url: '',
      instancesBackup: [],
    };
  },
  computed: {
    instancesExisted() {
      return this.instances.length && this.pods.length;
    },
    filters() {
      return {
        app: {
          name: '',
          id: '',
        },
        kind: this.kinds[0],
        instance: {
          name: '',
          id: '',
        },
        pod: {
          name: '',
        },
      };
    },
  },
  async created() {
    this.loading = true;
    if (this.filters.kind) {
      await this.init();
    }
  },
  methods: {
    async init() {
      this.applications = await this.fetchApplications();
      const { tab, id, app } = this.$route.query;
      this.filters.app = tab === 'app' ? { name: app, id } : this.applications[0] || { name: '' };
      await this.onClickApp();
    },
    async fetchApplications() {
      this.setFilters(true);
      let appList;
      try {
        const list = await ApplicationService.listInstance(this.space.id, this.zone.id);
        appList = list.map(({ name, id }) => ({ name, id }));
        appList.unshift({ name: '全部', id: '' });
      } finally {
        this.setFilters(false);
      }
      return appList;
    },
    async fetchInstancesBasedApp() {
      const { items } = await ApplicationService.getInstance(this.filters.app.id);
      return items
        .map(({ kind, metadata: meta }) => ({
          name: meta.name,
          id: meta.uid,
          kind: MONITOR_KIND_MAP[kind],
        }))
        .filter(({ kind }) => !!kind);
    },

    async getAppMonitor({ pod, numberEx, name }) {
      return ApplicationService.getAppMonitor(
        pod,
        numberEx,
        name,
        this.space.id,
        this.zone.id,
        encodeURIComponent(MONITOR_TIME_MAP[this.timeRange][0]),
        encodeURIComponent(MONITOR_TIME_MAP[this.timeRange][1]),
      );
    },
    async onClickApp() {
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
    async onClickTimeRange() {
      await this.fetchIframe();
    },
  },
  mixins: [MonitorSelector],
};
