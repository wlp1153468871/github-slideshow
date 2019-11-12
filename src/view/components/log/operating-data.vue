<template>
  <div class="operating-data">
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
          end-placeholder="结束日期">
        </el-date-picker>
      </div>

      <div class="col-md-5 flex-cc">
        <span class="form-name">关键字：</span>
        <dao-input
          block
          type="text"
          v-model="filters.keyword"
          placeholder="支持ES查询语法,例: *keyword*"
          search>
        </dao-input>
      </div>
    </div>

    <div
      class="operating-data-view"
      v-loading="loading">
      <div class="operating-data-view-output">
        <table>
          <tbody>
          <tr
            class="operating-data-line"
            v-for="(history, index) in currentHistories"
            :key="index">
            <td
              class="operating-data-line-number"
              :data-line-number="index+1"></td>
            <td class="operating-data-line-text">{{ history }}</td>
          </tr>
          </tbody>
        </table>
        <p v-if="!histories.length" class="no-operating-data">暂无记录</p>
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
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { chunk, debounce } from 'lodash';
import TerminalHistoryService from '@/core/services/terminal-history.service';
import Pagination from '@/core/lib/criteria/pagination';

export default {
  name: 'operating-data',

  props: { name: { type: String, default: () => ('') } },

  data() {
    return {
      logOptions: {
        container: '',
      },
      current: 0,
      beginOfLogFile: -1,
      endOfLogFile: 99999,
      newerOfLogFile: 'next',
      olderOfLogFile: 'previous',
      newestOfLogFile: 'first',
      oldestOfLogFile: 'last',
      histories: [],
      pagination: {},
      currentHistories: [],
      limitHistories: 100,
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
    };
  },

  computed: {
    ...mapState(['zone', 'space']),

    pageNumber() {
      return Math.ceil(this.histories.length / this.limitHistories) - 1;
    },
  },

  created() {
    this.loadTerminalHistories();
  },

  methods: {
    onContainerSelectChange() {
      this.loadTerminalHistories();
    },

    loadTerminalHistories: debounce(function loadTerminalHistories(currentpage, goto) {
      this.loading = true;

      const query = {
        zone: this.zone.id, current: currentpage, goto, ...this.getSearchQuery(),
      };

      TerminalHistoryService.ListOperatingData(
        this.space.id,
        this.name,
        query,
      )
        .then(TerminalHistories => {
          console.log(TerminalHistories);
          const { current, logs } = TerminalHistories;
          this.current = current;
          if (logs === null) {
            this.histories = [];
            this.currentHistories = [];
          } else {
            // eslint-disable-next-line no-underscore-dangle
            this.histories = logs.map(item => `dataTime:${item._source.dateTime}  podName:${item._source.podName}  user:${item._source.user}  message: ${item._source.message}`);
          }
          this.pagination = new Pagination(this.histories, this.limitHistories, 0);
          this.currentHistories = this.pagination.gotoPage(0);
        })
        .finally(() => {
          this.loading = false;
        });
    }, 0.5 * 1e3),

    getSearchQuery() {
      const query = {};
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
      this.loadTerminalHistories(this.beginOfLogFile, this.oldestOfLogFile);
      this.pagination.gotoPage(0);
    },

    loadOlder() {
      if (this.pagination.tPage === 0) {
        this.loadTerminalHistories(this.current, this.olderOfLogFile);
      }
      this.currentHistories = this.pagination.prev();
    },

    loadNewer() {
      if (this.pagination.tPage === this.pageNumber) {
        this.loadTerminalHistories(this.current, this.newerOfLogFile);
      }
      this.currentHistories = this.pagination.next();
    },

    loadNewest() {
      this.loadTerminalHistories(this.endOfLogFile, this.newestOfLogFile);
      this.pagination.gotoPage(chunk(this.currentHistories, this.limitHistories).length - 1);
    },
  },

  watch: {
    'filters.keyword': {
      handler() {
        this.loadTerminalHistories();
      },
    },

    'filters.daterange': {
      handler() {
        this.loadTerminalHistories();
      },
    },
  },
};
</script>

<style lang="scss">
  .operating-data {
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

    .operating-data-view {
      position: relative;
      min-height: 300px;
      /*height: calc(100vh - 400px);*/
      margin-bottom: 20px;
      margin-top: 15px;
      background-color: rgb(51, 66, 79);
    }

    .operating-data-view-output {
      height: 100%;
      overflow: auto;
      padding: 20px 0;
      font-size: 12px;

      table {
        table-layout: fixed;
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;

        .operating-data-line {
          color: #d1d1d1;

          &:hover {
            background-color: #4e5963;
            color: #ededed;
          }
        }

        .operating-data-line-number {
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

        .operating-data-line-text {
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
          box-shadow: inset 0 0 4px 0 rgba(0, 0, 0, 0.08),
          inset 0 1px 3px 0 rgba(0, 0, 0, 0.06);
        }

        &:focus {
          outline: none;
        }
      }
    }

    .no-operating-data {
      color: #d1d1d1;
      padding-left: 20px;
      font-size: 14px;
    }
  }
</style>
