<template>
  <div class="pod-log-panel">
    <div class="container-detail">
      <!-- pod select -->
      <slot></slot>

      <label>Container: </label>
      <!-- containers select -->
      <el-select
        size="small"
        filterable
        v-model="logOptions.container"
        placeholder="Container Name"
        @change="swichContainer"
      >
        <el-option
          v-for="container in pod.spec.containers"
          :key="container.name"
          :label="container.name"
          :value="container.name"
        >
        </el-option>
      </el-select>

      <span class="container-state" v-if="containerStateReason || containerStatusKey">
        <span class="dash">&mdash;</span>
        <status-icon :status="containerState"> </status-icon>
        <span>{{ containerStateReason || containerStatusKey | sentence_case }}</span>
      </span>

      <span v-if="containerStartTime && logs.length">
        <span class="log-timestamps">
          日志开始于 {{ containerStartTime | date }} &nbsp;<span v-if="containerEndTime"
            >至 {{ containerEndTime | date }}</span
          >
        </span>
      </span>
    </div>

    <div class="log-view">
      <div class="top-operation">
        <span v-if="keys.length" class="log-icon" @click="configFormatOptions">
          {{ isFormatLog ? '取消' : '' }}格式化日志
        </span>
        <span v-if="isFormatLog" class="log-icon" @click="visible = true">
          配置格式参数
        </span>
        <span
          v-if="canSave && state && state !== 'empty'"
          class="log-icon icon-download"
          @click="saveLog"
        >
          <svg class="icon">
            <use xlink:href="#icon_download"></use>
          </svg>
        </span>
        <el-tooltip effect="dark" content="实时跟踪日志输出" placement="top">
          <span @click="onScrollBottom" class="log-icon scroll-bottom">
            <svg class="icon">
              <use xlink:href="#icon_scroll-bottom"></use>
            </svg>
          </span>
        </el-tooltip>
      </div>

      <div class="bottom-operation">
        <span @click="onScrollTop" class="log-icon scroll-top">
          <svg class="icon">
            <use xlink:href="#icon_scroll-top"></use>
          </svg>
        </span>
      </div>

      <div @mousewheel.passive="onScroll" class="log-view-output" ref="logView">
        <table @mouseup="copySelectionToClipboard">
          <tbody>
            <tr class="log-line" v-for="(log, index) in logs" :key="index">
              <td class="log-line-number" :data-line-number="index + 1"></td>
              <td class="log-line-text">
                <template v-if="!checkFormat">
                  {{ log.info }}
                </template>
                <template v-else>
                  <template v-if="!log.isJSON">
                    {{ log.message }}
                  </template>
                  <template v-else>
                    <template v-for="(key, idx) in orderKeys">
                      <span :key="idx">
                        <span v-if="keyVisible">{{ key }}</span>
                        <span>{{ log.message[key] }}</span>
                      </span>
                    </template>
                  </template>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
        <div
          v-if="!loading && !limitReached && !errorWhileRunning && state === 'logs'"
          class="log-end-msg"
        >
          End of log
        </div>
        <loading-three-bounce v-if="loading" style="padding: 10px;"> </loading-three-bounce>
        <p style="color: #cfcfcf; margin-left: 20px;">
          {{ emptyStateMessage }}
        </p>
      </div>
    </div>

    <div v-if="errorWhileRunning" class="text-muted">
      An error occurred loading the log.
      <span href="" @click="connect">Reload</span>
    </div>

    <dao-dialog
      :visible.sync="visible"
      header="格式化日志"
      @cancel="isFormatLog = false"
      @confirm="formatLog"
    >
      <div class="format-options">
        <d-alert style="margin: 0 10px 10px; width: auto;" message="可拖拽进行排序"> </d-alert>

        <div class="format-log">
          <el-checkbox-group v-model="checkKey">
            <draggable class="dragArea" v-model="keys">
              <el-checkbox
                class="list-group-item"
                v-for="(key, index) in keys"
                :key="index"
                :label="key"
              >
              </el-checkbox>
            </draggable>
          </el-checkbox-group>
        </div>

        <el-checkbox style="margin: 10px 0 0 10px;" v-model="showKey">
          显示 Key
        </el-checkbox>
      </div>
    </dao-dialog>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import { saveAs } from 'file-saver';
import SockJS from 'sockjs-client';

import { head, union, find, keys, includes, get as getValue, throttle, intersection } from 'lodash';
import PodService from '@/core/services/pod.service';
import NodeService from '@/core/services/node.service';
import draggable from 'vuedraggable';
import LogWorker from './log.worker.js';

export default {
  name: 'PodLogPanel',

  props: {
    pod: { type: Object, default: () => ({}) },
    podName: { type: String, default: '' },
    isManageView: { type: Boolean },
  },

  components: {
    draggable,
  },

  data() {
    const { namespace, zone: zoneId } = this.$route.params;
    return {
      autoScrollActive: true,
      cacheLogs: [],
      canSave: !!new Blob(),
      checkFormat: false,
      checkKey: [],
      containerEndTime: null,
      containerStartTime: null,
      containerStateReason: null,
      containerStatusKey: null,
      emptyStateMessage: '',
      errorWhileRunning: false,
      isFormatLog: false,
      keys: [],
      keyVisible: false,
      lasStatusKey: null,
      loading: true,
      logOptions: {
        container: null,
      },
      logs: [],
      orderKeys: [],
      selectedContainer: null,
      showKey: false,
      state: '',
      visible: false,
      worker: null,
      ws: null,
      namespace,
      zoneId,
    };
  },

  computed: {
    ...mapState(['space', 'zone']),

    limitReached() {
      return this.logs.length > 5000;
    },

    logCanRun() {
      return !includes(['New', 'Pending', 'Unknown'], this.pod.status.phase);
    },

    containerState() {
      return this.containerStateReason || Vue.filter('capitalize')(this.containerStatusKey);
    },
  },

  created() {
    this.logOptions.container = getValue(this.pod, 'spec.containers[0].name');
    this.connect();
  },

  updated() {
    if (this.autoScrollActive) {
      this.onScrollBottom();
    }
  },

  destroyed() {
    this.disconnect();
    if (this.worker) this.worker.terminate();
    this.worker = null;
  },

  methods: {
    connect() {
      this.loading = true;
      if (this.isManageView) {
        NodeService.getPodRealTimeLogssessionId(
          this.namespace,
          this.pod.metadata.name,
          this.logOptions.container,
          this.zoneId,
        )
          .then(res => {
            this.handlePodRealTimeLogs(res);
          })
          .catch(e => {
            console.error(e);
          });
      } else {
        PodService.getPodRealTimeLogssessionId(
          this.space.id,
          this.pod.metadata.name,
          this.zone.id,
          this.logOptions.container,
        )
          .then(res => {
            this.handlePodRealTimeLogs(res);
          })
          .catch(e => {
            console.error(e);
          });
      }
    },

    handlePodRealTimeLogs(res) {
      this.ws = new SockJS('/app-server/ws/v1/container/log');
      this.ws.onopen = () => {
        this.ws.send(JSON.stringify({ Op: 'bind', SessionID: res.id }));
        this.worker = new LogWorker();
        this.worker.onmessage = ({ data }) => {
          this.logs = Object.freeze([...this.logs, ...data.mapLogs]);
          this.keys = union(this.keys, data.keys);
        };
      };

      this.ws.onmessage = this.onmessage;

      this.ws.onclose = () => {
        this.loading = false;
        this.autoScrollActive = false;
        this.state = 'empty';
        this.emptyStateMessage = 'The logs are no longer available or could not be loaded.';
      };

      this.ws.onerror = () => {
        this.loading = false;
        this.autoScrollActive = false;
        if (this.pods.length === 0) {
          this.state = 'empty';
          this.emptyStateMessage = 'The logs are no longer available or could not be loaded.';
        } else {
          // if logs were running but something went wrong, will
          // show what we have & give option to retry
          this.errorWhileRunning = true;
        }
      };
    },

    disconnect() {
      if (this.ws) {
        this.ws.onopen = null;
        this.ws.onmessage = null;
        this.ws.onerror = null;
        this.ws.onclose = null;
        if (this.ws.readyState < 2) {
          this.ws.close();
        }
        this.ws = null;
      }
    },

    copySelectionToClipboard() {
      // eslint-disable-next-line no-unused-vars
      let text = '';
      if (window.getSelection) {
        text = window.getSelection();
      } else if (document.selection) {
        text = document.selection.createRange();
      }
      // 放到粘贴板里，操作浏览器自身的API
      document.execCommand('Copy'); // 执行浏览器的复制命令
    },

    onmessage(log) {
      this.state = 'logs';
      if (log.data.length) {
        this.cacheLogs.push(log.data);
        this.renderLogs();
      }
    },

    renderLogs: throttle(
      function renderLogsThrottle() {
        if (this.worker) this.worker.postMessage(this.$data.cacheLogs);
        this.cacheLogs = [];
      },
      500,
      { trailing: true },
    ),

    setContainerVars() {
      if (!this.pod) return;
      const containerStatus = find(getValue(this.pod, 'status.containerStatuses', {}), {
        name: this.logOptions.container,
      });
      const state = getValue(containerStatus, 'state');
      const statusKey = head(keys(state));
      const knownKey = includes(['running', 'waiting', 'terminated'], statusKey) ? statusKey : '';
      const lastState = getValue(containerStatus, 'lastState');
      const lastStatusKey = head(keys(lastState));
      const isWaiting = getValue(containerStatus, 'state.waiting');

      this.containerStatusKey = knownKey;
      this.containerStateReason = getValue(state, [statusKey, 'reason']);

      if (isWaiting) {
        this.lasStatusKey = lastStatusKey;
        this.containerStartTime = getValue(lastState, [lastStatusKey, 'startedAt']);
        this.containerEndTime = getValue(lastState, [lastStatusKey, 'finishedAt']);
      } else {
        this.containerStartTime = getValue(state, [statusKey, 'startedAt']);
        this.containerEndTime = getValue(state, [statusKey, 'finishedAt']);
      }
    },

    onScrollBottom() {
      this.scrollBottom(this.$refs.logView);
      this.autoScrollActive = true;
    },

    onScrollTop() {
      this.scrollTop(this.$refs.logView);
      this.autoScrollActive = false;
    },

    scrollBottom(node) {
      if (!node) {
        window.scrollTo(
          0,
          document.documentElement.scrollHeight - document.documentElement.clientHeight,
        );
      } else {
        node.scrollTop = node.scrollHeight;
      }
    },

    scrollTop(node) {
      if (!node) {
        window.scrollTo(null, 0);
      } else {
        node.scrollTop = 0;
      }
    },

    onScroll: throttle(
      function scrollThrottle() {
        this.autoScrollActive = false;
        const { logView } = this.$refs;
        if (!logView) return;
        if (logView.scrollHeight - logView.scrollTop <= logView.clientHeight) {
          this.autoScrollActive = true;
        }
      },
      500,
      { trailing: true },
    ),

    saveLog() {
      const { logView } = this.$refs;
      if (!logView) return;
      const text = logView.textContent;
      const filename = `${getValue(this, 'pod.metadata.name', 'ruyicloud')}.log`;
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, filename);
    },

    formatLog() {
      this.orderKeys = intersection(this.keys, this.checkKey);
      this.checkFormat = true;
      this.keyVisible = this.showKey;
    },

    configFormatOptions() {
      this.isFormatLog = !this.isFormatLog;
      if (!this.isFormatLog) {
        this.checkFormat = false;
      } else {
        this.visible = true;
      }
    },

    swichContainer() {
      this.reConnect();
    },

    reConnect() {
      this.disconnect();
      this.logs = [];
      this.connect();
    },
  },

  watch: {
    'logOptions.container': {
      immediate: true,
      handler() {
        this.setContainerVars();
      },
    },

    podName: {
      handler() {
        this.reConnect();
      },
    },
  },
};
</script>

<style lang="scss">
.pod-log-panel {
  .log-view {
    position: relative;
    margin-bottom: 20px;
    margin-top: 15px;
    background-color: rgb(51, 66, 79);
    height: calc(100vh - 300px);
  }

  .log-view-output {
    padding: 40px 15px 20px 0;
    font-size: 12px;
    height: 100%;
    overflow: auto;

    table {
      table-layout: fixed;
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;

      .log-line {
        color: #d1d1d1;

        &:hover {
          background-color: #4e5963;
          color: #ededed;
        }
      }

      .log-line-number {
        &:before {
          content: attr(data-line-number);
        }

        line-height: 20px;
        text-align: right;
        border-right: 1px #575d63 solid;
        padding-right: 10px;
        vertical-align: top;
        white-space: nowrap;
        width: 60px;
        color: #72767b;
      }

      .log-line-text {
        font-family: Menlo, Monaco, Consolas, monospace;
        padding: 0 10px;
        width: 100%;
        word-break: break-word;
        overflow-wrap: break-word;
        word-wrap: break-word;
        min-width: 0;
        line-height: 20px;
        font-weight: 900;

        span {
          span {
            margin-right: 10px;
          }
        }
      }
    }
  }

  .log-icon {
    background-color: #5f6b77;
    color: #fff;
    text-decoration: none;
    border-radius: 1px;
    display: inline-block;
    font-size: 12px;
    padding: 5px 10px;
    cursor: pointer;
    border: 1px solid #434a53;

    & + .log-icon {
      margin-left: 10px;
    }
  }

  .top-operation {
    position: absolute;
    right: 20px;
    top: 10px;
    display: flex;
  }

  .bottom-operation {
    position: absolute;
    right: 20px;
    bottom: 10px;
  }

  .container-detail {
    color: #3d444f;

    & > label {
      margin-left: 10px;
    }

    label {
      font-weight: 600;
    }

    .dash {
      margin: 0 8px;
    }
  }

  .log-timestamps {
    font-size: 91%;
    display: inline-block;
    color: #9ba3af;
    margin-left: 15px;
  }

  .format-options {
    padding: 20px;
  }

  .list-group-item {
    width: calc(50% - 20px);
    padding: 10px;
    margin: 0 10px 10px;
    border: 1px solid lightblue;
  }
}
</style>
