<template>
  <div class="terminal">
    <div v-if="noContainersYet" class="empty-state-message">
      <h2>
        该 Pod 没有正在运行的容器
      </h2>
    </div>
    <div v-else>
      <div class="hint-info">
        <svg class="icon">
          <use xlink:href="#icon_info"></use>
        </svg>
        <span>
                When you navigate away from this pod, any open terminal connections will be closed.
                This will kill any foreground processes you started from the&nbsp;terminal.
              </span>
      </div>

      <div class="container-detail">
              <span v-if="pod.spec.containers.length === 1">
                <label>Container:</label>{{ pod.spec.containers[0].name }}
              </span>

<!--        <el-select-->
<!--          v-else-->
<!--          @change="onTerminalSelectChange"-->
<!--          size="small"-->
<!--          filterable-->
<!--          v-model="selectedTerminalContainer"-->
<!--          value-key="containerName"-->
<!--          placeholder="Container Name"-->
<!--        >-->
<!--          <el-option-->
<!--            v-for="term in containerTerminals"-->
<!--            :key="term.containerName"-->
<!--            :label="term.containerName"-->
<!--            :value="term"-->
<!--          >-->
<!--          </el-option>-->
<!--        </el-select>-->

<!--        <button-->
<!--          v-if="pod.metadata.name"-->
<!--          style="float: right;"-->
<!--          class="dao-btn blue mini btn-sm"-->
<!--          @click="dialogs.saveFile = true"-->
<!--        >-->
<!--          下载文件-->
<!--        </button>-->
      </div>

<!--      <div-->
<!--        v-if="activeTab === TABS.TERMINAL.name"-->
<!--        class="container-terminal-wrapper"-->
<!--        :class="{ disconnected: selectedTerminalContainer.status === 'disconnected' }"-->
<!--      >-->
<!--        <div v-for="(term, index) in containerTerminals" :key="index">-->
<!--          <container-terminal-->
<!--            v-if="term.isUsed"-->
<!--            v-show="term.isVisible"-->
<!--            :pod="pod"-->
<!--            :container="term.containerName"-->
<!--            :status.sync="term.status"-->
<!--            :autofocus="true"-->
<!--            :isManageView='false'-->
<!--          >-->
<!--          </container-terminal>-->
<!--        </div>-->
<!--      </div>-->
    </div>
  </div>
</template>

<script>
import { RESOURCE_TYPE } from '@/core/constants/resource';
import { chunk, nth, includes, find, get as getValue, head, keys } from 'lodash';
import PodTable from '@/view/components/resource/pod-table/pod-table';
import { POLL_INTERVAL } from '@/core/constants/constants';
import PodService from '@/core/services/pod.service';
import ResourceMixin from '@/view/mixins/resource';

export default {
  name: 'console',

  mixins: [ResourceMixin(RESOURCE_TYPE.POD)],
  props: {
    pods: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  components: {
    PodTable,
  },

  data() {
    return {
      loadings: {
        page: true,
        table: true,
      },
      //  控制台数据
      noContainersYet: false,
      pod: {},
      containerTerminals: [],
      selectedTerminalContainer: null,
    };
  },

  created() {
    this.loading = true;
    this.getPod(true).finally(() => {
      this.loading = false;
      this.poll();
    });
  },

  computed: {
    deleteable() {
      return this.$can('pod.delete') && this.canSelect;
    },

    podsFilteredByKey() {
      const filterKey = this.filterKey.toLowerCase();
      return this.pods.filter(pod => pod.metadata.name.toLowerCase().includes(filterKey));
    },

    paginaPods() {
      return chunk(this.podsFilteredByKey, this.pageSize);
    },

    podsInCurrentPage() {
      return nth(this.paginaPods, this.currentPage - 1);
    },

    totalPages() {
      return this.podsFilteredByKey.length;
    },
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
      const { podName } = this;
      return PodService.get({ podName }).then(pod => {
        this.pod = pod.originData;
        if (initial) this.containerTerminals = this.makeTerminals();
        this.updateContainersYet(this.pod);
      });
    },

    // handleTabClick(tab) {
    //   const tabName = tab.name;
    //   if (tabName === TABS.EVENT.name) {
    //     this.getEvents();
    //   }
    // },

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
      const { podName } = this;
      PodService.delete({ podName }).then(() => {
        this.$noty.success(`开始执行对 Pod ${this.podName} 的删除操作`);
        this.goBack();
      });
    },

    getEvents() {
      const { podName } = this;
      PodService.getEvents({ podName }).then(response => {
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
</script>

<style scoped lang="scss">
  .empty-state-message {
    max-width: 600px;
    padding-right: 20px;
    padding-left: 20px;
    margin: 40px auto 60px;
    color: #9ba3af;
    text-align: center;

    h2 {
      font-size: 22px;
      font-weight: 400;
      line-height: 1.4;
    }
  }
  .hint-info {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    color: #595f69;
    line-height: 20px;

    .icon {
      margin-right: 5px;
    }
  }
  .container-detail {
    color: #3d444f;

    label {
      font-weight: 600;
    }
  }
</style>
