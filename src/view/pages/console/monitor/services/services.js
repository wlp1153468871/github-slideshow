import SpaceService from '@/core/services/space.service';
import { mapState } from 'vuex';
import { MONITOR_TIME_MAP } from '@/core/constants/constants';
import MonitorSelector from '@/view/mixins/monitor-selector';

export default {
  data() {
    return {
      filters: {
        servicesBroker: {
          name: '',
          id: '',
          type: '',
        },
        instance: {
          name: '',
          id: '',
        },
      },
      instances: [],
      pods: [],
      loading: false,
      iframe: false,
      url: '',
      instancesBackup: [],
    };
  },
  computed: {
    ...mapState(['services', 'space', 'zone']),
    instancesExisted() {
      return this.instances.length;
    },
    servicesBrokers() {
      return this.services
        .filter(s => s.monitor)
        .map(({ name, route, services }) => ({
          name,
          id: route.query.brokerServiceId,
          type: services[0].name,
        }));
    },
  },

  async created() {
    // eslint-disable-next-line prefer-destructuring
    this.filters.servicesBroker = this.servicesBrokers[0];
  },
  methods: {
    async fetchInstancesBaseService() {
      const instanceId = this.filters.servicesBroker.id;
      const items = await SpaceService.getInstances(instanceId);
      this.instances = items ? items.map(({ name, id }) => ({ name, id })) : {};
      // eslint-disable-next-line prefer-destructuring
      this.filters.instance = this.instances[0];
      if (this.filters.instance.name) {
        await this.fetchIframe();
      }
      return this.instances;
    },

    async onClickKind() {
      this.fetchInstancesBaseService();
    },

    async onClickTimeRange() {
      await this.fetchIframe();
    },

    async onClickInstance() {
      if (this.filters.instance.name) {
        await this.fetchIframe();
      }
    },

    async fetchIframe() {
      this.iframe = true;
      const { url } = await SpaceService.getServiceMonitor(
        this.filters.instance.name,
        this.space.id,
        this.zone.id,
        this.filters.servicesBroker.type,
        encodeURIComponent(MONITOR_TIME_MAP[this.timeRange][0]),
        encodeURIComponent(MONITOR_TIME_MAP[this.timeRange][1]),
      );
      this.url = url;
      this.iframe = true;
    },
  },
  mixins: [MonitorSelector],
};
