import ServiceService from '@/core/services/service.service';
// panels
import CatalogPanel from './panels/catalog';

export default {
  name: 'HomeSetting',
  components: {
    CatalogPanel,
  },
  data() {
    const TABS = {
      CATALOG: '导航条目',
    };
    return {
      TABS,
      content: TABS.CATALOG,
      services: [],
    };
  },
  methods: {
    getAllService() {
      ServiceService.getServices(1, -1).then(services => {
        this.services = services;
      });
    },
  },
};
