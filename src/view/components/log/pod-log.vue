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
        placeholder="Container Name">
        <el-option
          v-for="container in pod.spec.containers"
          :key="container.name"
          :label="container.name"
          :value="container.name">
        </el-option>
      </el-select>

      <span class="container-state" v-if="containerStateReason || containerStatusKey">
        <span class="dash">&mdash;</span>
        <status-icon :status="containerState">
        </status-icon>
        <span>{{containerStateReason || containerStatusKey | sentence_case}}</span>
      </span>

      <span v-if="containerStartTime && logs.length">
        <span class="log-timestamps">
          日志开始于 {{containerStartTime | date}}
          &nbsp;<span v-if="containerEndTime">至 {{containerEndTime | date}}</span>
        </span>
      </span>
    </div>

    <div class="log-view">
      <span
        v-if="canSave && state && state !== 'empty'"
        class="log-icon icon-download"
        @click="saveLog">
        <svg class="icon">
          <use xlink:href="#icon_download"></use>
        </svg>
      </span>
      <el-tooltip
        effect="dark"
        content="实时跟踪日志输出"
        placement="top">
        <span @click="onScrollBottom" class="log-icon scroll-bottom">
        <svg class="icon">
          <use xlink:href="#icon_scroll-bottom"></use>
        </svg>
      </span>
      </el-tooltip>
      <span @click="onScrollTop" class="log-icon scroll-top">
        <svg class="icon">
          <use xlink:href="#icon_scroll-top"></use>
        </svg>
      </span>
      <div
        @mousewheel="onScroll()"
        class="log-view-output"
        ref="logView">
        <table @mouseup="copySelectionToClipboard">
          <tbody>
          <tr
            class="log-line"
            v-for="(message, index) in logs"
            :key="index">
            <td
              class="log-line-number"
              :data-line-number="index+1">
            </td>
            <td class="log-line-text">{{ message }}</td>
          </tr>
          </tbody>
        </table>
        <div
          v-if="(!loading) && (!limitReached) && (!errorWhileRunning) && state === 'logs'"
          class="log-end-msg">
          End of log
        </div>
        <loading-three-bounce
          v-if="loading"
          style="padding: 10px;">
        </loading-three-bounce>
        <p style="color: #cfcfcf; margin-left: 20px;">
          {{emptyStateMessage}}
        </p>
      </div>
    </div>

    <div v-if="errorWhileRunning" class="text-muted">
      An error occurred loading the log.
      <span href="" @click="connect">Reload</span>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import { saveAs } from 'file-saver';
import { head, find, keys, includes, get as getValue, debounce } from 'lodash';
import PodService from '@/core/services/pod.service';

export default {
  name: 'PodLogPanel',

  props: {
    pod: { type: Object, default: () => ({}) },
    podName: { type: String, default: '' },
  },

  data() {
    return {
      selectedContainer: null,
      ws: null,
      logs: [],
      logOptions: {
        container: null,
      },
      containerStatusKey: null,
      containerStateReason: null,
      containerStartTime: null,
      containerEndTime: null,
      lasStatusKey: null,
      loading: true,
      state: '',
      emptyStateMessage: '',
      autoScrollActive: true,
      errorWhileRunning: false,
      canSave: !!new Blob(),
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
      return (
        this.containerStateReason ||
        Vue.filter('capitalize')(this.containerStatusKey)
      );
    },
  },

  created() {
    this.logOptions.container = getValue(this.pod, 'spec.containers[0].name');
    this.connect();
  },

  updated() {
    // Follow the bottom of the log if auto-scroll is on.
    if (this.autoScrollActive) {
      this.autoScrollBottom();
    }
  },

  destroyed() {
    this.disconnect();
  },

  methods: {
    connect() {
      this.loading = true;
      try {
        this.ws = PodService.getRealTimeLogs({
          pod: this.pod.metadata.name,
          container: this.logOptions.container,
          space: this.pod.metadata.namespace,
        });

        this.ws.onopen = () => {
          // console.log('WebSocket 建立成功');
        };

        this.ws.onmessage = this.renderLogs;

        this.ws.onclose = () => {
          this.loading = false;
          this.autoScrollActive = false;
          // console.log('disconnected', ev);
          this.state = 'empty';
          this.emptyStateMessage =
            'The logs are no longer available or could not be loaded.';
        };

        this.ws.onerror = () => {
          this.loading = false;
          this.autoScrollActive = false;
          if (this.pods.length === 0) {
            this.state = 'empty';
            this.emptyStateMessage =
              'The logs are no longer available or could not be loaded.';
          } else {
            // if logs were running but something went wrong, will
            // show what we have & give option to retry
            this.errorWhileRunning = true;
          }
        };
      } catch (e) {
        // console.log(`WebSocket 建立失败：${e.message}`);
      }
    },

    disconnect() {
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onerror = null;
      this.ws.onclose = null;
      if (this.ws.readyState < 2) {
        this.ws.close();
      }
      this.ws = null;
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

    renderLogs(log) {
      this.state = 'logs';
      if (log.data.length) {
        this.logs.push(log.data);
      }
    },

    setContainerVars() {
      if (!this.pod) return;
      const containerStatus = find(
        getValue(this.pod, 'status.containerStatuses', {}),
        {
          name: this.logOptions.container,
        },
      );
      const state = getValue(containerStatus, 'state');
      const statusKey = head(keys(state));
      const knownKey = includes(['running', 'waiting', 'terminated'], statusKey)
        ? statusKey
        : '';
      const lastState = getValue(containerStatus, 'lastState');
      const lastStatusKey = head(keys(lastState));
      const isWaiting = getValue(containerStatus, 'state.waiting');

      this.containerStatusKey = knownKey;
      this.containerStateReason = getValue(state, [statusKey, 'reason']);

      if (isWaiting) {
        this.lasStatusKey = lastStatusKey;
        this.containerStartTime = getValue(lastState, [
          lastStatusKey,
          'startedAt',
        ]);
        this.containerEndTime = getValue(lastState, [
          lastStatusKey,
          'finishedAt',
        ]);
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
          document.documentElement.scrollHeight -
            document.documentElement.clientHeight,
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

    autoScrollBottom() {
      this.onScrollBottom();
    },

    onScroll: debounce(function onScroll() {
      this.autoScrollActive = false;
      const { logView } = this.$refs;
      if (!logView) return;
      if (logView.scrollHeight - logView.scrollTop <= logView.clientHeight) {
        this.autoScrollActive = true;
      }
    }, 300),

    saveLog() {
      const { logView } = this.$refs;
      if (!logView) return;
      const text = logView.textContent;
      const filename = `${getValue(this, 'pod.metadata.name', 'dsp')}.log`;
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, filename);
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
        this.disconnect();
        this.logs = [];
        this.connect();
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
        white-space: pre-wrap;
        width: 100%;
        word-break: break-word;
        overflow-wrap: break-word;
        word-wrap: break-word;
        min-width: 0;
        line-height: 20px;
        font-weight: 900;
      }
    }
  }

  .log-icon {
    position: absolute;
    right: 20px;
    background-color: #5f6b77;
    color: #fff;
    text-decoration: none;
    border-radius: 1px;
    display: inline-block;
    font-size: 12px;
    padding: 5px 10px;
    cursor: pointer;
  }

  .icon-download {
    top: 10px;
    right: 80px;
  }

  .scroll-bottom {
    top: 10px;
  }

  .scroll-top {
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
}
</style>
