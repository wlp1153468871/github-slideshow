import ServiceService from '@/core/services/service.service';
// panels
import CatalogPanel from './panels/catalog';

export default {
  name: 'HomeSetting',
  components: {
    CatalogPanel,
  },
  created() {
    this.getAllService();
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
      ServiceService.getServices().then(services => {
        this.services = services;
      });
    },
  },
};
