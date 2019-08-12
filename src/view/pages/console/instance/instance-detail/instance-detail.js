import isApprove from '@/core/utils/is-approve';
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { first, get as getValue, orderBy } from 'lodash';
import { INSTANCE_STATUS, SERVICE_TYPES } from '@/core/constants/constants';
import InstanceService from '@/core/services/instance.service';
import isTerminal from '@/core/utils/is-terminal';

import isURL from '@/core/utils/is-url';
import planDescMixin from '@/view/mixins/plan-desc';
// panels
import EventsPanel from './panels/events';
import MonitorPanel from './panels/monitor';
import OverviewPanel from './panels/overview';

const INFO_TYPE = {
  STRING: 'string',
  MARKDOWN: 'markdown',
  LINK: 'link',
};

const GRAFANA_URL = 'grafanaUrl';

export default {
  name: 'InstanceDetail',

  mixins: [planDescMixin],

  components: {
    OverviewPanel,
    EventsPanel,
    MonitorPanel,
  },

  data() {
    const TABS = {
      OVERVIEW: '基本属性',
      EVENTS: '操作记录',
      MONITOR: '监控',
      SENIOR: '设置',
    };

    const { serviceId, instanceId } = this.$route.params;

    return {
      loading: true,
      serviceId,
      instanceId,
      INSTANCE_STATUS,
      SERVICE_TYPES,
      TABS,
      activeTabName: TABS.OVERVIEW,
      instance: {},
      informations: [],
      basicInformations: [],
      dashboards: [],
      events: [],
      btns: [],
      monitorUrl: undefined,
      loadings: {
        instance: false,
        actions: false,
        events: false,
      },
      dialogConfigs: {
        editIp: { visible: false },
      },
      action: {}, // select action, only for 企业网 IP
    };
  },

  computed: {
    ...mapGetters(['zoneId', 'getService', 'isZoneSyncing']),

    resource() {
      return {
        key: this.instanceId,
        name: this.instance.name,
        logo: this.service.logo_url,
        helpUrl: this.service.help_url,
        links: [
          { text: this.service.name, route: this.instanceRoute },
          { text: this.instance.name },
        ],
      };
    },

    service() {
      try {
        return this.getService(this.serviceId);
      } catch (e) {
        console.error(e);
        this.$router.push({
          name: 'console.dashboard',
        });
      }
      return {};
    },

    brokerService() {
      return first(this.service.services) || {};
    },

    hasMonitorUrl() {
      if (this.monitorUrl === undefined) return true;
      return this.monitorUrl !== '';
    },

    canDelete() {
      return (
        this.$can('delete') &&
        !isApprove(this.instance.status) &&
        this.brokerService.instances_deletable &&
        !this.isZoneSyncing
      );
    },

    showOperations() {
      return (
        (this.instance.status === INSTANCE_STATUS.RUNNING &&
          this.dashboards.length) ||
        this.canDelete
      );
    },

    serviceType() {
      return this.service.service_type;
    },

    instanceRoute() {
      const {
        params: { serviceId },
        query: { brokerServiceId },
      } = this.$route;
      return {
        name: 'console.instances',
        params: {
          serviceId,
        },
        query: {
          brokerServiceId,
        },
      };
    },
  },

  created() {
    this.syncBaseInfo();
  },

  methods: {
    gotoTab(tab) {
      if (tab === 'events') {
        this.activeTabName = this.TABS.EVENTS;
      }
    },

    loadDetails() {
      this.loadings.instance = true;
      return InstanceService.getInstance(this.instanceId)
        .then(instance => {
          this.instance = instance;
          const { information = [], instance_metadata } = this.instance;
          const dashboardUrl = getValue(
            instance_metadata,
            'status.dashboardURL',
          );
          const dashboards = [];
          if (dashboardUrl) {
            dashboards.push({
              name: '控制台',
              value: dashboardUrl,
            });
          }
          const informations = [];
          information.forEach(info => {
            if (info.type === INFO_TYPE.STRING && isURL(info.value)) {
              info.type = INFO_TYPE.LINK;
              if (isTerminal(info.name)) {
                dashboards.push(info);
              }
              if (info.name === GRAFANA_URL) {
                this.monitorUrl = info.value;
                return;
              }
            }
            informations.push(info);
          });
          this.basicInformations = this.getBasicInfos(instance);
          this.informations = informations;
          this.dashboards = dashboards;
        })
        .finally(() => {
          if (this.monitorUrl === undefined) this.monitorUrl = '';
          this.loadings.instance = false;
        });
    },

    loadInstanceAction(instanceId) {
      this.loadings.actions = true;
      return InstanceService.getActions(instanceId)
        .then(btns => {
          this.btns = btns;
        })
        .finally(() => {
          this.loadings.actions = false;
        });
    },

    loadEvents() {
      return InstanceService.getLogs(this.instanceId).then(events => {
        this.events = orderBy(events, 'started_at', 'desc');
      });
    },

    // TODO: fix bullet…
    getBasicInfos(instance) {
      const {
        plan = {},
        owner = {},
        organizationName,
        spaceName,
        zoneName,
      } = instance;
      const planField = this.generatePlanDesc(plan, instance.service.name);
      const unixDate = Vue.filter('unix_date');
      return [
        { name: '租户 / 项目组', value: `${organizationName} / ${spaceName}` },
        { name: '区域 / 环境', value: `${zoneName}` },
        ...planField,
        { name: '创建者', value: owner.name },
        { name: '创建时间', value: unixDate(instance.created_at) },
      ];
    },

    openDashboard() {
      const action = first(this.dashboards);
      if (action) {
        window.open(action.value, '_blank');
      }
    },

    handleAction(actionId) {
      if (!actionId) return;

      const action = this.btns.find(x => x.id === actionId);
      InstanceService.executeActions(this.instanceId, action)
        .then(() => {
          this.$noty.success(`${action.name} 操作成功!`);
        })
        .catch(() => {
          this.$noty.error(`${action.name} 操作失败!`);
        });
    },

    syncBaseInfo() {
      this.loading = true;
      Promise.all([
        this.loadDetails(this.instanceId),
        this.loadInstanceAction(this.instanceId),
        this.loadEvents(),
      ]).finally(() => {
        this.loading = false;
      });
    },

    removeConfirm() {
      this.$tada
        .confirm({
          title: '删除实例',
          text: `您确定要删除实例 ${this.instance.name} 吗？`,
        })
        .then(willDelete => {
          if (willDelete) this.removeInstance(this.instance);
        });
    },

    removeInstance(instance) {
      const {
        params: { serviceId },
        query: { brokerServiceId },
      } = this.$route;
      InstanceService.deleteInstance(instance.id).then(() => {
        this.$noty.success(`正在删除实例 ${instance.name} `);
        this.$router.push({
          name: 'console.instances',
          params: {
            serviceId,
          },
          query: {
            brokerServiceId,
          },
        });
      });
    },
  },

  watch: {
    $route(to) {
      const { serviceId, instanceId } = to.params;
      this.serviceId = serviceId;
      this.instanceId = instanceId;
      this.service = this.getService(this.serviceId);
      this.syncBaseInfo();
    },
  },
};
