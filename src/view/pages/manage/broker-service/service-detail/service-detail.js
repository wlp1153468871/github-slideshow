import BrokerServiceService from '@/core/services/broker-service.service';
import QuotaService from '@/core/services/quota.service';
import PlansPanel from './panels/plans';
import QuotaFieldPanel from './panels/quota-field';

export default {
  name: 'ServiceDetail',
  components: {
    PlansPanel,
    QuotaFieldPanel,
  },
  async created() {
    await this.loadAvailableFields();
    this.loadService();
  },
  data() {
    const brokerServiceId = this.$route.params.service;
    return {
      allField: [],
      quotaDict: {},
      brokerService: {
        id: brokerServiceId,
        name: '...',
        zoneId: '...',
        zoneName: '...',
      },
      plans: [],
      SIDE_BAR: {
        PLANS: '规格管理',
        QUOTA_FIELD: '配额字段',
        CONNECT: '接入设置',
        OVERVIEW: '设置',
      },
      loadings: {
        brokerService: false,
      },
    };
  },
  methods: {
    loadAvailableFields() {
      QuotaService.listQuotaFields().then(fields => {
        this.allField = fields;
        fields.forEach(field => {
          this.quotaDict[field.code] = field;
        });
      });
    },
    loadService() {
      this.loadings.brokerService = true;
      BrokerServiceService.getBrokerService(this.brokerService.id)
        .then(res => {
          this.brokerService = res;
        })
        .finally(() => {
          this.loadings.brokerService = false;
        });
    },

    addServiceQuota(params) {
      return QuotaService.addServiceQuota(this.brokerService.id, params).then(() => {
        this.loadService();
        this.$noty.success('添加配额种类成功');
      });
    },

    removeServiceQuota(quota) {
      return QuotaService.deleteServiceQuota(this.brokerService.id, quota.id).then(() => {
        this.loadService();
        this.$noty.success('删除字段成功');
      });
    },
  },
};
