import { mapState } from 'vuex';
import { isEmpty, cloneDeep, set, get } from 'lodash';
import { RESOURCE } from '@/core/constants/resource';
import { POLL_INTERVAL, MONITOR_ALL_PODS } from '@/core/constants/constants';
import DeploymentResourceService from '@/core/services/deployment.resource.service';
import HPAService from '@/core/services/hpa.service';
import OperatingData from '@/view/components/log/operating-data';

// panels
import LogOfflinePanel from '@/view/components/log/log-offline.vue';
import LogPanel from '@/view/components/log/log.vue';
import MonitorPanel from '@/view/pages/console/resource/deployment-config/detail/panels/monitor';
import PodsPanel from './panels/pods';
import EnvPanel from './panels/env';
import HistoryPanel from './panels/history';
import InfoPanel from './panels/info';

const TABS = {
  PODS: { label: '容器组', name: 'overview' },
  LOG: { label: '实时日志', name: 'log' },
  OFFLINE_LOG: { label: '离线日志', name: 'offline-log' },
  CONFIGURATION: { label: '概览', name: 'configuration' },
  HISTORY: { label: '历史版本', name: 'history' },
  EVENT: { label: '事件', name: 'event' },
  ENV: { label: '环境变量', name: 'env' },
  OPERATING_DATA: { label: '操作记录', name: 'operating-data' },
  MONITOR: { label: '查看监控', name: 'viewing-monitor' },
};

export default {
  name: 'Resource-Deployment',

  components: {
    PodsPanel,
    EnvPanel,
    HistoryPanel,
    InfoPanel,
    LogOfflinePanel,
    LogPanel,
    OperatingData,
    MonitorPanel,
  },

  data() {
    const { name: deploymentName } = this.$route.params;

    return {
      resource: {
        ...RESOURCE.DEPLOYMENT,
        links: [
          {
            text: RESOURCE.DEPLOYMENT.name,
            route: { name: 'resource.deployments' },
          },
          { text: deploymentName },
        ],
      },
      dialogs: {
        view: false,
      },
      deploymentName,
      TABS,
      tab: TABS.CONFIGURATION.name,
      loadings: {
        page: true,
        table: true,
      },
      status: '',
      deployment: {},
      containers: [],
      events: [],
      isEmpty,
      jobs: [],
      imagesByDockerReference: {}, // TODO: fix this
      autoscalers: [],
      name: deploymentName,
      pods: [],
    };
  },

  computed: {
    ...mapState(['space', 'zone']),
  },

  created() {
    this.loadData();
  },

  methods: {
    poll() {
      this.pollTimer = setTimeout(() => {
        clearTimeout(this.pollTimer);
        Promise.all([this.getDeployment(), this.listHPA()]).then(() => {
          this.poll();
        });
      }, POLL_INTERVAL);
    },
    unsetPolling() {
      clearTimeout(this.pollTimer);
    },

    loadData() {
      this.loadings.page = true;
      this.loadings.table = true;
      Promise.all([this.getDeployment(), this.listHPA(), this.fetchPods()]).finally(() => {
        this.loadings.page = false;
        this.loadings.table = false;
      });
    },

    getDeployment() {
      return DeploymentResourceService.get(
        this.space.id,
        this.zone.id,
        this.deploymentName,
      ).then(deployment => {
        this.deployment = deployment.originData;
        this.status = deployment.status;
        this.operatingData = {
          name: this.deploymentName,
          namespace: this.deployment.metadata.namespace,
        };
      });
    },

    listHPA() {
      return HPAService.list().then(res => {
        this.autoscalers = HPAService.filterHPA(
          res.items,
          'Deployment',
          this.deploymentName,
        );
      });
    },

    async fetchPods() {
      const res = await DeploymentResourceService
        .getPods(this.space.id, this.zone.id, this.deploymentName);
      this.pods = get(res, 'originData.items', []).map(({ metadata }) => metadata);
      if (this.pods.length > 1) {
        this.pods.unshift({ name: MONITOR_ALL_PODS });
      }
    },

    handleTabClick(tab) {
      const tabName = tab.name;
      if (tabName === TABS.EVENT.name) {
        this.getEvents();
      }
    },

    getEvents() {
      this.loadings.table = true;
      DeploymentResourceService.getEventsAndLatestHistoryEvents(
        this.space.id,
        this.zone.id,
        this.deploymentName,
      )
        .then(res => {
          this.events = res || [];
        })
        .finally(() => {
          this.loadings.table = false;
        });
    },

    ensureRemove() {
      this.$tada
        .confirm({
          title: `删除 ${this.deploymentName}  `,
          text: `您确定要删除Deployment ${this.deploymentName} 吗？`,
        })
        .then(ok => {
          if (ok) {
            this.removeDeployment();
          }
        });
    },

    removeDeployment() {
      this.loadings.page = true;
      DeploymentResourceService.delete(
        this.space.id,
        this.zone.id,
        this.deploymentName,
      )
        .then(() => {
          this.$noty.success(`删除Deployment ${this.deploymentName} 成功`);
          this.$router.push({ name: 'resource.deployments' });
        })
        .finally(() => {
          this.loadings.page = false;
        });
    },

    onEnvUpdate(env) {
      const newYaml = cloneDeep(this.deployment);
      set(newYaml, 'spec.template.spec.containers', env);
      this.update(newYaml);
    },

    updateDeployment() {
      this.dialogs.view = true;
    },

    update(value) {
      this.loadings.table = true;
      DeploymentResourceService.updateDeployment(
        this.space.id,
        this.zone.id,
        this.deploymentName,
        value,
      )
        .then(() => {
          return this.getDeployment();
        })
        .then(() => {
          if (this.status === 'approving') {
            this.$noty.success('创建审批成功');
          } else {
            this.$noty.success('更新成功');
          }
        })
        .finally(() => {
          this.loadings.table = false;
        });
    },

    restartDeployment() {
      this.loadings.table = true;
      DeploymentResourceService.restart(
        this.space.id,
        this.zone.id,
        this.deploymentName,
      )
        .then(() => {
          this.$noty.success(`重启Deployment ${this.deploymentName} 成功`);
        })
        .finally(() => {
          this.loadings.table = false;
        });
    },

    scale(replicas) {
      DeploymentResourceService.scale(
        this.space.id,
        this.zone.id,
        this.deploymentName,
        replicas,
      )
        .then(() => {
          return this.getDeployment();
        })
        .then(() => {
          if (this.status === 'approving') {
            this.$noty.success('创建审批成功');
          } else {
            this.$noty.success('更新成功');
          }
        })
        .finally(() => {
          this.loadings.table = false;
        });
    },
  },
};
