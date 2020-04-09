import { SERVICE_STATUS } from '@/core/constants/constants';
import ServiceService from '@/core/services/service.service';
import Vue from 'vue';

export default {
  name: 'ServiceList',
  created() {
    this.loadService();
  },
  data() {
    return {
      rows: [],
      loadings: {
        maps: false,
      },
      filterMethod: (data, filterKey) =>
        data.name.toLowerCase().includes(filterKey) ||
        data.short_description.toLowerCase().includes(filterKey),
      other: {
        status: (_, item) => {
          return item.available === SERVICE_STATUS.AVAILABLE ? 'SUCCESS' : 'STOPED';
        },
      },
    };
  },
  methods: {
    renderStatus(status) {
      const filters = Vue.filter('filters');
      return filters(status, 'service_status');
    },

    loadService() {
      this.loadings.maps = true;
      return ServiceService.getServices()
        .then(list => {
          this.rows = list;
        })
        .finally(() => {
          this.loadings.maps = false;
        });
    },
  },
};
