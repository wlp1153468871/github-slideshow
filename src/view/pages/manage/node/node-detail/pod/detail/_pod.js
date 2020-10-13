import { find, get as getValue, head, keys } from 'lodash';
import { POLL_INTERVAL } from '@/core/constants/constants';
import NodeService from '@/core/services/node.service';
import FileSaveInContainer from '@/view/components/resource/file-save-in-container/file-save-in-container';
import PodLogPanel from '@/view/components/log/pod-log.vue';
import PodLogOfflinePanel from '@/view/components/log/pod-offline-log.vue';
import TerminalHistoryPanel from '@/view/components/log/terminal-history.vue';

import PodStatusPanel from './panels/pod-status';
import PodTemplatePanel from './panels/pod-template';
import MonitorPanel from './panels/monitor';

const TABS = {
  OVERVIEW: { label: '容器组', name: 'overview' },
  TERMINAL: { label: '控制台', name: 'terminal' },
  TERMINAL_HISTORY: { label: '控制台记录', name: 'terminal_history' },
  REALTIME_LOG: { label: '实时日志', name: 'realtime-log' },
  OFFLINE_LOG: { label: '离线日志', name: 'offline_log' },
  ENV: { label: '环境变量', name: 'env' },
  EVENT: { label: '事件', name: 'event' },
  MONITOR: { label: '查看监控', name: 'viewing-monitor' },
};

export default {
  name: 'ResourcePod',

  components: {
    PodStatusPanel,
    PodTemplatePanel,
    PodLogPanel,
    PodLogOfflinePanel,
    FileSaveInContainer,
    TerminalHistoryPanel,
    MonitorPanel,
  },

  data() {
    const { podName, namespace, zone: zoneId, node } = this.$route.params;

    return {
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
      podName,
      namespace,
      zoneId,
      node,
      selectedTerminalContainer: null,
      terminalCols: 120,
      terminalRows: 100,
      resource: {},
    };
  },

  created() {
    this.loading = true;
    if (this.namespace) {
      this.getPod(true).finally(() => {
        this.loading = false;
        this.poll();
      });
    }
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

    getPod(initial = false) {
      return NodeService.getPodsDetail(this.namespace, this.podName, this.zoneId).then(pod => {
        this.pod = pod;
        this.resource = {
          key: this.pod.metadata.uid,
          name: this.pod.metadata.name,
          icon: '#icon_node',
          logo: '#icon_node-logo',
          links: [
            { text: '节点管理', route: { name: 'manage.node.list' } },
            { text: this.node, route: { name: 'manage.node.detail' } },
            { text: this.pod.metadata.name },
          ],
        };
        if (initial) this.containerTerminals = this.makeTerminals();
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
          title: `删除 ${this.podName}  `,
          text: `您确定要删除Pod ${this.podName} 吗？`,
        })
        .then(ok => {
          if (ok) {
            this.removePod();
          }
        });
    },

    removePod() {
      NodeService.deletePods(this.namespace, this.podName, this.zoneId).then(() => {
        this.$noty.success(`开始执行对 Pod ${this.podName} 的删除操作`);
        this.goBack();
      });
    },

    getEvents() {
      NodeService.getPodsEvents(this.namespace, this.podName, this.zoneId).then(response => {
        this.events = getValue(response, 'items');
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
      this.noContainersYet = this.getContainersRunning(pod.status.containerStatuses) === 0;
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
