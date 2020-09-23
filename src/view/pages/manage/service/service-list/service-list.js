import { SERVICE_STATUS } from '@/core/constants/constants';
import ServiceService from '@/core/services/service.service';
import Vue from 'vue';

export default {
  name: 'ServiceList',
  created() {
    // 有权限查看 无权限提示
    if (this.$can('platform.serviceInstance.get')) {
      this.loadService();
    } else {
      this.$noty.error('您暂无服务列表查看权限');
    }
  },
  data() {
    return {
      rows: [],
      loadings: {
        maps: false,
      },
      filterMethod: this.filterService,
      other: {
        status: (_, item) => {
          return item.available === SERVICE_STATUS.AVAILABLE ? 'SUCCESS' : 'STOPED';
        },
      },
      total: 0,
    };
  },
  methods: {
    renderStatus(status) {
      const filters = Vue.filter('filters');
      return filters(status, 'service_status');
    },

    loadService(page, pageSize, q) {
      this.loadings.maps = true;
      return ServiceService.getServices(page, pageSize, q)
        .then(list => {
          this.rows = list.data;
          this.total = list.total;
        })
        .finally(() => {
          this.loadings.maps = false;
        });
    },
    filterService(filterKey, pageSize) {
      this.loadService(1, pageSize, filterKey);
    },
    switchPage(page, pageSize, filterKey) {
      this.loadService(page, pageSize, filterKey);
    },
  },
};
