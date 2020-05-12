import { RESOURCE_TYPE } from '@/core/constants/resource';
import Vue from 'vue';
import { keyBy, chunk, nth, get as getValue } from 'lodash';
import { mapState } from 'vuex';
import RouteService from '@/core/services/route.service';
import isWebRouteFilter from '@/view/filters/resource/is-web-route.filter';
import ServiceService from '@/core/services/service.resource.service';
import joinApproveStatus from '@/core/utils/joinApproveStatus';
import ResourceMixin from '@/view/mixins/resource';
import RouteWarnings from '../components/route-warnings/route-warnings';

export default {
  name: 'RouteList',

  mixins: [ResourceMixin(RESOURCE_TYPE.ROUTE)],

  components: {
    RouteWarnings,
  },

  data() {
    return {
      filterKey: '',
      routeIngressInfo:
        'The route is not accepting traffic yet because it has not been admitted by a router.',
      routes: [],
      services: {},
      currentPage: 1,
      pageSize: 10,
      loadings: {
        table: false,
        page: true,
      },
    };
  },

  computed: {
    ...mapState(['user']),

    routesFilteredByKey() {
      const filterKey = this.filterKey.toLowerCase();
      return this.routes.filter(route => route.metadata.name.toLowerCase().includes(filterKey));
    },

    paginaRoutes() {
      return chunk(this.routesFilteredByKey, this.pageSize);
    },

    routesInCurrentPage() {
      return nth(this.paginaRoutes, this.currentPage - 1);
    },

    totalPages() {
      return this.routesFilteredByKey.length;
    },
  },

  created() {
    this.init();
  },

  methods: {
    isWebRouteFilter,

    init() {
      this.loadings.table = true;
      Promise.all([this.getServices(), this.getRoutes()])
        .then(([serviceList, routeList]) => {
          this.routes = joinApproveStatus(routeList, {
            spec: { host: '', to: {} },
            status: { ingress: [] },
          });
          this.services = keyBy(serviceList.items, 'metadata.name');
          this.addRouteTargetPortMapping();
        })
        .finally(() => {
          this.loadings.page = false;
          this.loadings.table = false;
        });
    },

    getRoutes() {
      return RouteService.list(this.space.id, this.zone.id);
    },

    getServices() {
      return ServiceService.list();
    },

    addRouteTargetPortMapping() {
      const filter = Vue.filter('route_target_port_mapping');
      this.routes.forEach(route => {
        const mapping = filter(route, this.services[route.spec.to.name]);
        if (mapping) {
          route.routeTargetPortMapping = mapping;
        }
      });
    },

    createRoute() {
      this.$router.push({
        name: 'deploy.routes',
      });
    },

    gotoDetail(volume) {
      this.$router.push({
        name: 'resource.routes.detail',
        params: {
          name: volume.metadata.name,
        },
      });
    },

    ensureRemove(route) {
      const {
        metadata: { name },
      } = route;
      this.$tada
        .confirm({
          title: '删除 Route',
          text: `您确定要删除 Route ${name} 吗？`,
        })
        .then(willDelete => {
          if (willDelete) {
            this.deleteRouter(name);
          }
        });
    },

    deleteRouter(name) {
      RouteService.delete(this.space.id, this.zone.id, name).then(() => {
        this.$noty.success(`开始执行对 Route ${name} 的删除操作`);
        this.getRoutes();
      });
    },

    hasServiceBeenDeleted(serviceName) {
      return !!getValue(this.services, serviceName);
    },

    serviceDeletedMessage(name) {
      return `Routes to service <em>${name}</em>, but service does not exist.`;
    },

    sortName(prev, next) {
      return getValue(prev, 'metadata.name') - getValue(next, 'metadata.name');
    },
  },
};
