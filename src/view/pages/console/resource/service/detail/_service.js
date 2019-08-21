import { POLL_INTERVAL } from '@/core/constants/constants';
import { each, get as getValue } from 'lodash';
import { RESOURCE } from '@/core/constants/resource';
import ServiceResourceService from '@/core/services/service.resource.service';
import PodTable from '@/view/components/resource/pod-table/pod-table';
import EndpointService from '@/core/services/endpoint.service';
import PodService from '@/core/services/pod.service';
import ServiceOverviewPanel from './panels/overview';

const TABS = {
  OVERVIEW: { label: '概览', name: 'overview' },
  POD: { label: '容器组', name: 'pod' },
  EVENT: { label: '事件', name: 'event' },
};

export default {
  name: 'ResourceService',

  components: {
    ServiceOverviewPanel,
    PodTable,
  },

  data() {
    const { name: serviceName } = this.$route.params;
    const { tab } = this.$route.query;

    return {
      resource: {
        ...RESOURCE.SERVICE,
        links: [
          { text: RESOURCE.SERVICE.name, route: RESOURCE.SERVICE.route },
          { text: serviceName },
        ],
      },
      TABS,
      activeTab: tab || TABS.OVERVIEW.name,
      dialogs: {
        update: false,
      },
      events: [],
      loadings: {
        page: true,
        pod: true,
      },
      pods: [],
      status: '',
      service: null,
      serviceName,
      routesForService: {},
      portsByRoute: {},
      showNodePorts: false,
      podsWithEndpoints: {},
      pollTimer: null,
    };
  },

  created() {
    this.init();
  },

  destroyed() {
    this.unsetPolling();
  },

  watch: {
    activeTab: {
      immediate: true,
      handler(tabName) {
        if (tabName === TABS.EVENT.name) {
          this.getEvents();
        }
        if (tabName === TABS.POD.name) {
          this.pollPods();
        }
      },
    },
  },

  methods: {
    pollPods() {
      this.pollTimer = setTimeout(() => {
        clearTimeout(this.pollTimer);
        Promise.all([this.getPods(), this.getEndpointsByService()]).then(() => {
          this.pollPods();
        });
      }, POLL_INTERVAL);
    },

    unsetPolling() {
      clearTimeout(this.pollTimer);
    },

    init() {
      this.loadings.page = true;
      return Promise.all([
        this.getService(),
        this.getRoutes(),
      ])
        .then(() => {
          this.getPortsByRoute();
        })
        .finally(() => {
          this.loadings.page = false;
        });
    },

    getService() {
      const { serviceName } = this;
      return ServiceResourceService
        .get({ name: serviceName })
        .then(({ originData = null, status }) => {
          this.service = originData;
          this.status = status;
        });
    },

    getRoutes() {
      return ServiceResourceService
        .getRoutes({ name: this.serviceName })
        .then(({ originData: { items = [] } }) => {
          items.forEach(route => {
            this.routesForService[route.metadata.name] = route;
          });
        });
    },

    getEndpointsByService() {
      return EndpointService.getEndpointsByService({
        name: this.serviceName,
      }).then(svcEndpoint => {
        const newpodsWithEndpoints = {};
        each(svcEndpoint.subsets, subset => {
          each(subset.addresses, address => {
            if (getValue(address, 'targetRef.kind') === 'Pod') {
              newpodsWithEndpoints[address.targetRef.name] = true;
            }
          });
        });
        this.podsWithEndpoints = newpodsWithEndpoints;
      });
    },

    // receives routes for the current service and maps service ports to each route name
    getPortsByRoute() {
      this.portsByRoute = {};
      each(this.service.spec.ports, port => {
        let reachedByRoute = false;
        if (port.nodePort) {
          this.showNodePorts = true;
        }

        each(this.routesForService, route => {
          if (
            !route.spec.port ||
            route.spec.port.targetPort === port.name ||
            route.spec.port.targetPort === port.targetPort
          ) {
            this.portsByRoute[route.metadata.name] =
              this.portsByRoute[route.metadata.name] || [];
            this.portsByRoute[route.metadata.name].push(port);
            reachedByRoute = true;
          }
        });

        if (!reachedByRoute) {
          this.portsByRoute[''] = this.portsByRoute[''] || [];
          this.portsByRoute[''].push(port);
        }
      });
    },

    getEvents() {
      const { serviceName } = this;
      ServiceResourceService.getEvents({
        name: serviceName,
      }).then(({ originData: { items } }) => {
        this.events = items;
      });
    },

    getPods() {
      return ServiceResourceService.getPods({ name: this.serviceName })
        .then(({ originData: { items } }) => {
          this.pods = items;
        })
        .finally(() => {
          this.loadings.pod = false;
        });
    },

    ensureRemove() {
      this.$tada
        .confirm({
          title: `删除 ${this.serviceName}  `,
          text: `您确定要删除Service ${this.serviceName} 吗？`,
        })
        .then(ok => {
          if (ok) {
            this.removeService();
          }
        });
    },

    removeService() {
      const { serviceName } = this;
      ServiceResourceService.delete({ name: serviceName }).then(() => {
        this.$noty.success(`删除Service ${this.podName} 成功`);
        this.$router.push({ name: 'resource.services.list' });
      });
    },

    openUpdateDialog() {
      this.dialogs.update = true;
    },

    updateService(service) {
      const { serviceName } = this;
      ServiceResourceService.update({ name: serviceName, data: service })
        .then(() => {
          return this.init();
        })
        .then(() => {
          if (this.status === 'approving') {
            this.$noty.success('创建审批成功');
          } else {
            this.$noty.success('更新成功');
          }
        })
        .finally();
    },

    ensureRemovePods(pods) {
      this.$tada
        .confirm({
          title: '删除',
          text: `确认要删除 ${pods.length} 个容器组吗 ？`,
          primaryText: '确定',
          primaryLevel: 'success',
        })
        .then(willAgree => {
          if (willAgree) {
            this.removePods(pods);
          }
        });
    },

    removePods(pods) {
      PodService.batchDelete({
        names: pods.map(pod => pod.metadata.name).join(','),
      }).then(() => {
        this.$noty.success('删除成功');
        this.init();
      });
    },
  },
};
