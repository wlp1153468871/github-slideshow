import { mapState } from 'vuex';
import { isEmpty, cloneDeep, set } from 'lodash';
import { POLL_INTERVAL } from '@/core/constants/constants';
import DeploymentResourceService from '@/core/services/deployment.resource.service';
import HPAService from '@/core/services/hpa.service';

// panels
import LogOfflinePanel from '@/view/components/log/log-offline.vue';
import LogPanel from '@/view/components/log/log.vue';
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
  },

  data() {
    const { name: deploymentName } = this.$route.params;

    return {
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
    };
  },

  computed: {
    ...mapState(['space', 'zone', 'apiResource']),

    resource() {
      return {
        ...this.apiResource.Deployment,
        links: [
          {
            text: this.apiResource.Deployment.kind,
            route: this.apiResource.Deployment.route,
          },
          { text: this.deploymentName },
        ],
      };
    },
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
      Promise.all([this.getDeployment(), this.listHPA()]).finally(() => {
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

    handleTabClick(tab) {
      const tabName = tab.name;
      if (tabName === TABS.EVENT.name) {
        this.getEvents();
      }
    },

    getEvents() {
      this.loadings.table = true;
      DeploymentResourceService.getEvents(
        this.space.id,
        this.zone.id,
        this.deploymentName,
      )
        .then(res => {
          this.events = res.originData.items || [];
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
          this.$router.push({ name: 'resource.deployments.list' });
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
