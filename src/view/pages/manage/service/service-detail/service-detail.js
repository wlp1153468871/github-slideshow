import { SERVICE_STATUS } from '@/core/constants/constants';
import ServiceService from '@/core/services/service.service';
import OverviewPanel from './panels/overview';
import SourcePanel from './panels/source';
import ZonePanel from './panels/zone';

export default {
  name: 'ServiceDetail',
  components: {
    OverviewPanel,
    SourcePanel,
    ZonePanel,
  },
  created() {
    this.loadService();
  },
  data() {
    const SIDE_BAR = {
      ZONES: '可用区绑定',
      SOURCES: '相关资源',
      OVERVIEW: '设置',
    };

    const { id } = this.$route.params;
    return {
      service: {
        id,
        pictures: [],
      },
      SIDE_BAR,
      loadings: {
        setting: false,
      },
    };
  },
  computed: {
    serviceAvailable() {
      return this.service.available === SERVICE_STATUS.AVAILABLE;
    },
    serviceUnavailable() {
      return this.service.available === SERVICE_STATUS.UNAVAILABLE;
    },
  },
  methods: {
    loadService() {
      return ServiceService.getService(this.service.id).then(service => {
        this.service = service;
      });
    },

    toggleAvailable(params) {
      ServiceService.updateService(this.service.id, this.service.zone.id, params)
        .then(service => {
          this.service = service;
          this.$noty.success(`成功${params.available === 'available' ? '上架' : '下架'}${
            this.service.name
          }服务!`);
        })
        .catch(() => {
          this.$noty.error(`${params.available ? '上架' : '下架'}${
            this.service.name
          }服务失败!`);
        });
    },

    confirmStackService() {
      this.$tada
        .confirm({
          title: '上架服务',
          text: `您确定要上架服务 ${this.service.name} 吗？`,
          primaryText: '上架',
          dangerMode: false,
        })
        .then(enable => {
          if (enable) {
            this.toggleAvailable({ available: 'available' });
          }
        });
    },

    confirmUnStackService() {
      this.$tada
        .confirm({
          title: '下架服务',
          text: `
        您确定要下架服务 ${this.service.name} 吗？
        与本服务绑定的服务在各个可用区下的实例将依然存在。
        `,
          primaryText: '下架',
        })
        .then(enable => {
          if (enable) {
            this.toggleAvailable({ available: 'unavailable' });
          }
        });
    },
  },
};
