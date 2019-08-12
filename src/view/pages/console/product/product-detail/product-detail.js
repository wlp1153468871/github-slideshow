import { first } from 'lodash';
import ServiceService from '@/core/services/service.service';

export default {
  name: 'ProductDetail',

  created() {
    this.loadService();
  },

  data() {
    return {
      service: {
        id: this.$route.params.product,
      },
      bigUrl: '',
    };
  },

  methods: {
    loadService() {
      ServiceService.getService(this.service.id).then(service => {
        this.service = service;
        if (service.pictures.length) {
          this.show(first(service.pictures));
        }
      });
    },

    checkout() {
      const { brokerService } = this.service;

      const instanceListRouteConfig = {
        name: 'console.instances',
        params: {
          serviceId: this.service.id,
        },
        query: {
          brokerServiceId: brokerService.id,
        },
      };

      this.$router.push(instanceListRouteConfig);
    },

    show(item) {
      this.bigUrl = item;
    },
  },
};
