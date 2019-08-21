import { mapState, mapGetters } from 'vuex';
import { orderBy, groupBy } from 'lodash';
import { APPLICATION_CONFIG } from '@/core/constants/app';
import { POLL_INTERVAL } from '@/core/constants/constants';
import { RESOURCE } from '@/core/constants/resource';
import InstanceService from '@/core/services/instance.service';
import ApplicationService from '@/core/services/application.service';
import Loading from '@/view/components/loading/circles';
import EditYamlDialog from '@/view/components/yaml-edit/edit-yaml';
import PodTable from '@/view/components/resource/pod-table/pod-table';
import PvcTable from '@/view/components/resource/pvc-table/pvc-table';

// panels
import OverviewPanel from './panels/overview';
import LogPanel from './panels/log.vue';
import LogOfflinePanel from './panels/log-offline.vue';
import DeploymentPanel from './panels/deployment';
import ServicePanel from './sections/service.vue';
import RoutePanel from './sections/route.vue';
import JobPanel from './panels/job';
import EventPanel from './panels/event';
import ConfigPanel from './panels/config';
import ParameterPanel from './panels/parameter';

const TABS = {
  OVERVIEW: '总览',
  LOG: '实时日志',
  OFFLINE_LOG: '离线日志',
  DEPLOYMENT: 'Deployment',
  SERVICE: 'Service',
  ROUTE: 'Route',
  INGRESS: 'Ingress',
  POD: 'Pod',
  CONFIGMAP: 'Config Map',
  VOLUME: 'PVC',
  EVENT: 'Event',
  JOB: '操作记录',
  PARAMETER: '设置',
};

export default {
  name: 'AppDetail',

  components: {
    Loading,
    EditYamlDialog,
    OverviewPanel,
    LogPanel,
    LogOfflinePanel,
    JobPanel,
    EventPanel,
    DeploymentPanel,
    ConfigPanel,
    ParameterPanel,
    ServicePanel,
    RoutePanel,
    PodTable,
    PvcTable,
  },

  created() {
    this.syncBaseInfo();
    this.poll();
  },
  destroyed() {
    this.unsetPolling();
  },
  data() {
    const {
      params: { instanceId },
    } = this.$route;

    return {
      appConfig: {},
      activeTab: TABS.OVERVIEW,
      instanceId,
      TABS,
      instance: {},
      yaml: '',
      dialogConfigs: {
        editYaml: { visible: false },
      },
      loadings: {
        instance: false,
        updateByYaml: false,
      },
      events: [],
      resources: {
        Deployment: [],
        DeploymentConfig: [],
        Service: [],
        Pod: [],
        ConfigMap: [],
        Secret: [],
        PersistentVolumeClaim: [],
      },
    };
  },

  computed: {
    ...mapGetters(['zoneId']),
    ...mapState(['space']),

    breadcrumbLinks() {
      return [
        {
          text: '应用列表',
          route: { name: 'console.applications' },
        },
        {
          text: this.instance.name,
        },
      ];
    },

    resource() {
      return {
        ...APPLICATION_CONFIG,
        links: this.breadcrumbLinks,
      };
    },

    service() {
      return APPLICATION_CONFIG;
    },
  },

  methods: {
    poll() {
      this.pollTimer = setTimeout(() => {
        clearTimeout(this.pollTimer);
        this.loadApplicationInstance().then(() => {
          this.poll();
        });
      }, POLL_INTERVAL);
    },

    unsetPolling() {
      clearTimeout(this.pollTimer);
    },

    syncBaseInfo() {
      this.loadings.instance = true;
      this.loadApplicationInstance().finally(() => {
        this.loadings.instance = false;
      });
      this.loadEvents();
      this.loadInstanceYAML();
    },

    loadApplicationInstance() {
      return Promise.all([
        ApplicationService.getInstance(this.instanceId),
        this.loadInstanceSecrets(),
      ]).then(([instance, secrets]) => {
        this.instance = instance;

        const resources = [...instance.items, ...secrets];
        this.resources = groupBy(resources, 'kind');
      });
    },

    loadInstanceSecrets() {
      if (!this.$can('read', RESOURCE.SECRET.key)) {
        return Promise.resolve([]);
      }

      return ApplicationService.getInstanceSecrets(this.instanceId)
        .then(res => res.items || [])
        .catch(() => {
          return Promise.resolve([]);
        });
    },

    loadEvents() {
      InstanceService.getLogs(this.instanceId).then(events => {
        this.events = orderBy(events, 'started_at', 'desc');
      });
    },

    loadInstanceYAML() {
      if (this.$can('read', RESOURCE.SECRET.key)) {
        ApplicationService.getInstanceYaml(this.instanceId).then(yaml => {
          this.yaml = yaml;
        });
      }
    },

    onUpdateYaml(yaml) {
      this.loadings.updateByYaml = true;
      ApplicationService.updateInstanceYaml(this.instanceId, yaml)
        .then(() => {
          this.loadInstanceYAML();
          this.$noty.success('操作成功');
        })
        .finally(() => {
          this.loadings.updateByYaml = false;
          this.syncBaseInfo();
        });
    },

    toggleYamlDialog() {
      this.dialogConfigs.editYaml.visible = !this.dialogConfigs.editYaml
        .visible;
    },

    gotoJobsTab() {
      this.switchTab({ name: TABS.JOB });
    },

    switchTab(tab) {
      this.activeTab = tab.name;
    },
  },
};
