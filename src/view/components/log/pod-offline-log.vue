<template>
  <div class="pod-offline-log">
    <div class="container-detail">
      <!-- pod list -->
      <slot></slot>

      <!-- pod container -->
      <label>Container: </label>
      <el-select
        @change="onContainerSelectChange"
        size="small"
        filterable
        v-model="logOptions.container"
        placeholder="Container Name"
      >
        <el-option
          v-for="container in pod.spec.containers"
          :key="container.name"
          :label="container.name"
          :value="container.name"
        >
        </el-option>
      </el-select>
    </div>

    <div class="row">
      <div class="col-md-7 flex-cc">
        <span class="form-name">时间段：</span>
        <el-date-picker
          class="daox-date-picker"
          style="width: 100%;"
          size="small"
          v-model="filters.daterange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </div>

      <div class="col-md-5 flex-cc">
        <span class="form-name">关键字：</span>
        <dao-input
          block
          type="text"
          v-model="filters.keyword"
          placeholder="支持ES查询语法,例: *keyword*"
          search
        >
        </dao-input>
      </div>
    </div>

    <div class="log-view" v-loading="loading">
      <div class="log-view-output">
        <table>
          <tbody>
            <tr class="log-line" v-for="(log, index) in currentLogs" :key="index">
              <td class="log-line-number" :data-line-number="index + 1"></td>
              <td class="log-line-text">{{ log }}</td>
            </tr>
          </tbody>
        </table>
        <p v-if="!logs.length" class="no-log">暂无日志</p>
      </div>
    </div>

    <div class="app-log-footer">
      <div class="log-btn-group">
        <button @click="loadOldest">
          <svg class="icon" style="transform: rotate(180deg);">
            <use xlink:href="#icon_caret-more"></use>
          </svg>
        </button>
        <button @click="loadOlder">
          <svg class="icon">
            <use xlink:href="#icon_caret-left"></use>
          </svg>
        </button>
        <button @click="loadNewer">
          <svg class="icon">
            <use xlink:href="#icon_caret-right"></use>
          </svg>
        </button>
        <button @click="loadNewest">
          <svg class="icon">
            <use xlink:href="#icon_caret-more"></use>
          </svg>
        </button>
      </div>
      <button @click="downloadLog" class="dao-btn ghost has-icon">
        <svg class="icon">
          <use xlink:href="#icon_download"></use>
        </svg>
        <span class="text">下载日志</span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { chunk, debounce, get as getValue } from 'lodash';
import { saveAs } from 'file-saver';

import AppService from '@/core/services/app.service';
import NodeService from '@/core/services/node.service';
import Pagination from '@/core/lib/criteria/pagination';

export default {
  name: 'PodOfflineLogPanel',

  props: {
    pod: { type: Object, default: () => ({}) },
    isManageView: { type: Boolean, default: false },
  },

  data() {
    const { podName, namespace, zone: zoneId } = this.$route.params;
    return {
      logOptions: {
        container: '',
      },
      current: 0,
      beginOfLogFile: -1,
      endOfLogFile: 99999,
      newerOfLogFile: 'newer',
      olderOfLogFile: 'older',
      newestOfLogFile: 'newest',
      oldestOfLogFile: 'oldest',
      logs: [],
      pagination: {},
      currentLogs: [],
      limitLogs: 100,
      filters: {
        keyword: null,
        daterange: null,
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      loading: true,
      podName,
      namespace,
      zoneId,
    };
  },

  computed: {
    ...mapState(['zone', 'space']),

    pageNumber() {
      return Math.ceil(this.logs.length / this.limitLogs) - 1;
    },

    downloadUrl() {
      const query = Object.entries(this.getSearchQuery())
        .map(pair => pair.join('='))
        .join('&');
      return `/v1/spaces/${this.space.id}/pods/${this.pod.metadata.name}/log/download?${query}`;
    },
  },

  created() {
    this.logOptions.container = getValue(this.pod, 'spec.containers[0].name');
    this.loadPodLogs();
  },

  methods: {
    downloadLog() {
      this.loading = true;
      if (this.isManageView) {
        NodeService.downloadLog(
          this.namespace,
          this.podName,
          this.logOptions.container,
          this.zoneId,
          this.getSearchQuery(),
        )
          .then(res => {
            saveAs(res, `${this.pod.metadata.name}.log`);
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        AppService.downloadLog(this.space.id, this.pod.metadata.name, this.getSearchQuery())
          .then(res => {
            saveAs(res, `${this.pod.metadata.name}.log`);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    onContainerSelectChange() {
      this.loadPodLogs();
    },

    loadPodLogs: debounce(function loadPodLogs(currentpage, goto) {
      this.loading = true;

      const query = {
        currentpage,
        goto,
        ...this.getSearchQuery(),
      };

      if (this.isManageView) {
        NodeService.listPodLogs(
          this.namespace,
          this.podName,
          this.logOptions.container,
          this.zoneId,
          query,
        )
          .then(podLogs => {
            this.handleListPodLogs(podLogs);
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        AppService.listPodLogs(
          this.zone.id,
          this.space.id,
          this.pod.metadata.name,
          this.logOptions.container,
          query,
        )
          .then(podLogs => {
            this.handleListPodLogs(podLogs);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    }, 0.5 * 1e3),

    handleListPodLogs(podLogs) {
      const { current, logs } = podLogs;

      this.current = current;
      if (logs === null) {
        this.logs = [];
        this.currentLogs = [];
      } else {
        // eslint-disable-next-line no-underscore-dangle
        this.logs = logs.map(item => item._source.message);
      }
      this.pagination = new Pagination(this.logs, this.limitLogs, 0);
      this.currentLogs = this.pagination.gotoPage(0);
    },

    getSearchQuery() {
      const query = {
        zone: this.zone.id,
        container_name: this.logOptions.container,
      };
      const { daterange, keyword } = this.filters;
      if (daterange) {
        const [from, to] = daterange.map(time => {
          return time.toISOString();
        });
        if (from) query.from = from;
        if (to) query.to = to;
      }
      if (keyword) query.keyword = keyword;

      return query;
    },

    loadOldest() {
      this.loadPodLogs(this.beginOfLogFile, this.oldestOfLogFile);
      this.pagination.gotoPage(0);
    },

    loadOlder() {
      if (this.pagination.tPage === 0) {
        this.loadPodLogs(this.current, this.olderOfLogFile);
      }
      this.currentLogs = this.pagination.prev();
    },

    loadNewer() {
      if (this.pagination.tPage === this.pageNumber) {
        this.loadPodLogs(this.current, this.newerOfLogFile);
      }
      this.currentLogs = this.pagination.next();
    },

    loadNewest() {
      this.loadPodLogs(this.endOfLogFile, this.newestOfLogFile);
      this.pagination.gotoPage(chunk(this.currentLogs, this.limitLogs).length - 1);
    },
  },

  watch: {
    'filters.keyword': {
      handler() {
        this.loadPodLogs();
      },
    },

    'filters.daterange': {
      handler() {
        this.loadPodLogs();
      },
    },

    'pod.metadata.name': {
      handler() {
        this.loadPodLogs();
      },
    },
  },
};
</script>

<style lang="scss">
.pod-offline-log {
  .container-detail {
    color: #3d444f;
    margin-bottom: 15px;
    & > label {
      margin-left: 10px;
    }
  }

  .flex-cc {
    display: flex;
    align-items: center;

    .form-name {
      flex-shrink: 0;
    }
  }

  .log-view {
    position: relative;
    min-height: 300px;
    /*height: calc(100vh - 400px);*/
    margin-bottom: 20px;
    margin-top: 15px;
    background-color: rgb(51, 66, 79);
  }

  .log-view-output {
    height: 100%;
    overflow: auto;
    padding: 20px 0;
    font-size: 12px;

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

  .app-log-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: #3d444f;
    margin-bottom: 20px;
  }

  .log-btn-group {
    float: left;
    margin-right: 8px;

    svg.icon {
      width: 20px;
      height: 20px;
    }

    & > button {
      padding: 6px 8px;
      border: none;
      border-radius: 50%;
      cursor: pointer;

      &:hover {
        background-color: #f5f7fa;
      }

      &:active {
        background-image: linear-gradient(
          180deg,
          rgba(204, 209, 216, 0.1),
          rgba(204, 209, 216, 0.1)
        );
        box-shadow: inset 0 0 4px 0 rgba(0, 0, 0, 0.08), inset 0 1px 3px 0 rgba(0, 0, 0, 0.06);
      }

      &:focus {
        outline: none;
      }
    }
  }

  .no-log {
    color: #d1d1d1;
    padding-left: 20px;
    font-size: 14px;
  }
}
</style>
