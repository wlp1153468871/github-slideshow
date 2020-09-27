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
        <span v-if="pods.length === 1">
          <label>Container:</label>{{ pods[0].metadata.name }}
        </span>

        <el-select
          v-else
          @change="onTerminalSelectChange"
          size="small"
          filterable
          v-model="selectedTerminalContainer"
          value-key="containerName"
          placeholder="Container Name"
        >
          <el-option
            v-for="term in getPods"
            :key="term.name"
            :label="term.name"
            :value="term.name"
          >
          </el-option>
        </el-select>
      </div>
<!--      容器-->
      <div class="container-terminal-wrapper">
        <div>
          <div v-if="showConsole" class="showConsole">正在加载<h3 class="dot">...</h3></div>
          <container-terminal
            v-if="terminals.isUsed"
            :pod="pod"
            :container="terminals.containerName"
            :status.sync="terminals.status"
            :autofocus="true"
          >
          </container-terminal>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RESOURCE_TYPE } from '@/core/constants/resource';
import { get as getValue, head, keys } from 'lodash';
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
      selectedTerminalContainer: this.pods[0].metadata.name,
      podName: this.pods[0].metadata.name,
      terminals: {},
      loading: true,
      showConsole: true,
    };
  },

  created() {
    this.getPod();
  },

  watch: {
    pods: {
      handler(newVal) {
        if (newVal.length === 0) {
          this.noContainersYet = true;
        }
      },
      immediate: true,
    },
    // terminals: {
    //   handler(newVal) {
    //     console.log(newVal, 'hello');
    //     if (!newVal.isUsed) {
    //       this.showConsole = true;
    //     } else {
    //       this.showConsole = false;
    //     }
    //   },
    //   immediate: true,
    //   deep: true,
    // },
  },

  computed: {
    getPods() {
      const arr = [];
      this.pods.forEach(item => {
        arr.push(item.metadata);
      });
      return arr;
    },
  },

  destroyed() {
    clearTimeout(this.pollTimer);
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

    // 获取pod详情
    getPod() {
      this.loading = true;
      const { podName } = this;
      return PodService.get({ podName }).then(pod => {
        this.pod = pod.originData;
        this.pod.status = pod.originData.status.phase;
        // if (initial) this.containerTerminals = this.makeTerminals(); // 得到一个数组
        // this.updateContainersYet(this.pod);
        this.terminals.containerName = pod.originData.spec.containers[0].name;
        this.terminals.isVisible = false;
        this.terminals.isUsed = true;
        this.terminals.containerState = '';
        this.terminals.status = pod.originData.status.phase;
        this.loading = false;
        this.showConsole = false;
      });
    },
    getState(containerStatus) {
      const state = getValue(containerStatus, 'state', {});
      return head(keys(state));
    },

    // 清洗数据
    makeTerminals() {
      this.terminals = {
        containerName: this.pod.spec.containers[0].name,
        isVisible: false,
        isUsed: false,
        containerState: '',
        status: this.pod.status.phase,
      };
    },
    /**
     * 多个pod组成的下拉列表改变时的回调函数
     * @param newTerm
     */
    onTerminalSelectChange(newTerm) {
      console.log(newTerm);
      // Make all terminals invisible (Because we don't have a pointer
      // to the terminal that is currently visible)
      this.podName = newTerm;
      this.showConsole = true;
      this.terminals = {
        isVisible: false,
        isUsed: false,
      }
      this.getPod();
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
  .showConsole {
    text-align: center;
    font-size: 25px;
    color: #318dff;
    margin-top: 15%;
  }
  .dot {
    display: inline-block;
    height: 1em;
    line-height: 1;
    text-align: left;
    vertical-align: -.25em;
    overflow: hidden;
  }
  .dot::before {
    display: block;
    content: '...\A..\A.\A';
    /* content: '......'; */
    white-space: pre-wrap;
    animation: dot 3s infinite step-start both;
  }
  @keyframes dot {
    33% { transform: translateY(-2em); }
    66% { transform: translateY(-1em); }
  }
</style>
