import { RESOURCE_TYPE } from '@/core/constants/resource';
import { find, get as getValue, head, keys } from 'lodash';
import { POLL_INTERVAL } from '@/core/constants/constants';
import PodService from '@/core/services/pod.service';
import FileSaveInContainer from '@/view/components/resource/file-save-in-container/file-save-in-container';
import PodLogPanel from '@/view/components/log/pod-log.vue';
import PodLogOfflinePanel from '@/view/components/log/pod-offline-log.vue';
import ResourceMixin from '@/view/mixins/resource';
import PodStatusPanel from './panels/pod-status';
import PodTemplatePanel from './panels/pod-template';

const TABS = {
  OVERVIEW: { label: '容器组', name: 'overview' },
  TERMINAL: { label: '控制台', name: 'terminal' },
  REALTIME_LOG: { label: '实时日志', name: 'realtime-log' },
  OFFLINE_LOG: { label: '离线日志', name: 'offline_log' },
  ENV: { label: '环境变量', name: 'env' },
  EVENT: { label: '事件', name: 'event' },
};

export default {
  name: 'ResourcePod',

  mixins: [ResourceMixin],

  components: {
    PodStatusPanel,
    PodTemplatePanel,
    PodLogPanel,
    PodLogOfflinePanel,
    FileSaveInContainer,
  },

  data() {
    return {
      kind: RESOURCE_TYPE.POD,
      TABS,
      activeTab: TABS.OVERVIEW.name,
      builds: {},
      characterBoundingBox: {},
      containerTerminals: [],
      dialogs: {
        view: false,
        saveFile: false,
      },
      events: [],
      imagesByDockerReference: {}, // TODO: what is this
      imageStreamImageRefByDockerReference: {},
      loading: true,
      noContainersYet: true,
      pod: {},
      selectedTerminalContainer: null,
      terminalCols: 120,
      terminalRows: 100,
    };
  },

  created() {
    this.loading = true;
    this.getPod().finally(() => {
      this.loading = false;
    });
    this.poll();
  },

  destroyed() {
    this.unsetPolling();
  },

  methods: {
    poll() {
      this.pollTimer = setTimeout(() => {
        clearTimeout(this.pollTimer);
        this.getPod().then(() => {
          this.poll();
        });
      }, POLL_INTERVAL);
    },

    unsetPolling() {
      clearTimeout(this.pollTimer);
    },

    getPod() {
      const { name } = this;
      return PodService.get({ podName: name }).then(pod => {
        this.pod = pod.originData;
        this.containerTerminals = this.makeTerminals();
        this.updateContainersYet(this.pod);
      });
    },

    handleTabClick(tab) {
      const tabName = tab.name;
      if (tabName === TABS.EVENT.name) {
        this.getEvents();
      }
    },

    viewYaml() {
      this.dialogs.view = true;
    },

    ensureRemove() {
      this.$tada
        .confirm({
          title: `删除 ${this.name}  `,
          text: `您确定要删除Pod ${this.name} 吗？`,
        })
        .then(ok => {
          if (ok) {
            this.removePod();
          }
        });
    },

    removePod() {
      const { name } = this;
      PodService.delete({ podName: name }).then(() => {
        this.$noty.success(`删除Pod ${this.name} 成功`);
        this.goBack();
      });
    },

    getEvents() {
      const { name } = this;
      PodService.getEvents({ podName: name }).then(response => {
        this.events = getValue(response, 'originData.items');
      });
    },

    getContainersRunning(containerStatuses) {
      let running = 0;
      if (containerStatuses) {
        containerStatuses.forEach(v => {
          if (v.state && v.state.running) {
            running += 1;
          }
        });
      }
      return running;
    },

    getState(containerStatus) {
      const state = getValue(containerStatus, 'state', {});
      return head(keys(state));
    },

    makeTerminals() {
      const terminals = [];

      this.pod.spec.containers.forEach(container => {
        const thisContainerStatus = find(this.pod.status.containerStatuses, {
          name: container.name,
        });
        const thisContainerState = this.getState(thisContainerStatus);

        terminals.push({
          containerName: container.name,
          isVisible: false,
          isUsed: false,
          containerState: thisContainerState,
        });
      });

      const currentlyVisible = head(terminals);
      currentlyVisible.isVisible = true;
      currentlyVisible.isUsed = true;

      this.selectedTerminalContainer = currentlyVisible;

      return terminals;
    },

    updateContainersYet(pod) {
      this.noContainersYet =
        this.getContainersRunning(pod.status.containerStatuses) === 0;
    },

    updateTerminals(terminals) {
      terminals.forEach(term => {
        const thisContainerStatus = find(this.pod.status.containerStatuses, {
          name: term.containerName,
        });
        term.containerState = this.getState(thisContainerStatus);
      });
    },

    onTerminalSelectChange(newTerm) {
      // Make all terminals invisible (Because we don't have a pointer
      // to the terminal that is currently visible)
      this.containerTerminals.forEach(term => {
        term.isVisible = false;
      });

      newTerm.isVisible = true;
      newTerm.isUsed = true;
      this.selectedTerminalContainer = newTerm;
    },
  },
};
