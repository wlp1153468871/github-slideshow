import AlarmService from '@/core/services/alarm.service.ts';

import MetricTable from './metric-table/metric-table.vue';

export default {
  data() {
    return {
      rules: [],
      loading: false,
      containerMetrics: [],
      appMetrics: [],

      serviceMetricsFull: {},
      serviceMetricsNames: [],
      currentMetricName: '',
    };
  },
  async created() {
    this.rules = await this.initMetrics();
  },
  components: {
    MetricTable,
  },
  computed: {
    serviceMetrics() {
      return this.serviceMetricsFull[this.currentMetricName];
    },
  },
  methods: {
    async initMetrics() {
      try {
        this.loading = true;
        const { container, app: { jmx }, service } = await AlarmService.getAllAlarmMetircs();
        this.containerMetrics = container;
        this.appMetrics = jmx;
        this.serviceMetricsFull = service;
        this.serviceMetricsNames = Object.keys(service);
        [this.currentMetricName] = this.serviceMetricsNames;
      } finally {
        this.loading = false;
      }
    },
  },
};
