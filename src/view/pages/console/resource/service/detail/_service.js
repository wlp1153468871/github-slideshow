import { POLL_INTERVAL } from '@/core/constants/constants';
import { RESOURCE_TYPE } from '@/core/constants/resource';
import ResourceMixin from '@/view/mixins/resource';
import { each, get as getValue } from 'lodash';
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

  mixins: [ResourceMixin],

  components: {
    ServiceOverviewPanel,
    PodTable,
  },

  data() {
    const { tab } = this.$route.query;

    return {
      kind: RESOURCE_TYPE.SERVICE,
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
      return Promise.all([this.getService(), this.getRoutes()])
        .then(() => {
          this.getPortsByRoute();
        })
        .finally(() => {
          this.loadings.page = false;
        });
    },

    getService() {
      const { name } = this;
      return ServiceResourceService.get({ name }).then(({ originData = null, status }) => {
        this.service = originData;
        this.status = status;
      });
    },

    getRoutes() {
      const { name } = this;
      return ServiceResourceService.getRoutes({ name }).then(({ originData: { items = [] } }) => {
        items.forEach(route => {
          this.routesForService[route.metadata.name] = route;
        });
      });
    },

    getEndpointsByService() {
      const { name } = this;
      return EndpointService.getEndpointsByService({
        name,
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
      const { name } = this;
      ServiceResourceService.getEvents({
        name,
      }).then(({ originData: { items } }) => {
        this.events = items;
      });
    },

    getPods() {
      const { name } = this;
      return ServiceResourceService.getPods({ name })
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
          title: `删除 ${this.name}  `,
          text: `您确定要删除Service ${this.name} 吗？`,
        })
        .then(ok => {
          if (ok) {
            this.removeService();
          }
        });
    },

    removeService() {
      const { name } = this;
      ServiceResourceService.delete({ name }).then(() => {
        this.$noty.success(`删除Service ${this.name} 成功`);
        this.goBack();
      });
    },

    openUpdateDialog() {
      this.dialogs.update = true;
    },

    updateService(service) {
      const { name } = this;
      ServiceResourceService.update({ name, data: service })
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
