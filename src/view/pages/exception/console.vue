<template>
  <div class="console-container">
    <div class="header">
      <div class="left-title">dev-645-java-demo-app</div>
      <button class="dao-btn icon-btn fresh-btn">
        <svg class="icon"><use xlink:href="#icon_cw"></use></svg>
      </button>
      <button class="dao-btn has-icon download-btn">
        <svg class="icon"><use xlink:href="#icon_download"></use></svg>
        <span class="text">下载日志</span>
      </button>
      <dao-input
        v-model="key"
        search
        class="search"
        placeholder="支持 ES 查询语法，例：“keyword”">
      </dao-input>
      <div class="right-title">关键字：</div>
    </div>
    <div class="operation">
      <span class="title">实例：</span>
      <dao-select
        style="width: 200px;"
        v-model="select"
        placeholder="一个简单下拉框"
      >
        <dao-option
          v-for="item in items"
          :key="item.value"
          :value="item.value"
          :label="item.text">
        </dao-option>
      </dao-select>
      <span class="title">分类：</span>
      <dao-select
        style="width: 100px;"
        v-model="select"
        placeholder="一个简单下拉框"
      >
        <dao-option
          v-for="item in items"
          :key="item.value"
          :value="item.value"
          :label="item.text">
        </dao-option>
      </dao-select>
      <span class="title">容器：</span>
      <dao-select
        style="width: 160px;"
        v-model="select"
        placeholder="一个简单下拉框"
      >
        <dao-option
          v-for="item in items"
          :key="item.value"
          :value="item.value"
          :label="item.text">
        </dao-option>
      </dao-select>
      <div class="title right-container">时段：
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
    </div>
    <div class="code-container" v-loading="loading.logs">
      <div class="code">
        <div v-for="(item, index) in currentLogs" :key="index" class="line">
          <div class="codeNumber">{{ index+1 }}</div>
          <!-- <pre class="instance"></pre> -->
          <pre class="codeText">{{ item }}</pre>
        </div>
      </div>
      <div class="touch">
        <span class="dao-btn-group">
          <dao-tooltip content="上一页" placement="top">
            <button class="dao-btn icon-btn icon-box" @click="prePage" :disabled="btnVisable">
              <svg class="icon"><use xlink:href="#icon_caret-left"></use></svg>
            </button>
          </dao-tooltip>
          <dao-tooltip content="下一页" placement="top">
            <button class="dao-btn icon-btn" @click="nextPage" :disabled="btnVisable">
              <svg class="icon"><use xlink:href="#icon_caret-right"></use></svg>
            </button>
          </dao-tooltip>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AppService from '@/core/services/app.service';
import Pagination from '@/core/lib/criteria/pagination';

export default {
  name: 'console',
  data() {
    return {
      key: '',
      select: 1,
      items: [{
        text: 'console',
        value: 1,
      }],
      date: '',
      current: 0,
      loading: {
        logs: false,
        expansion : false,
      },
      logs: [],
      limitLogs: 200,
      currentLogs: [],
      btnVisable: false,
    };
  },

  computed: {
    ...mapState(['zone', 'space']),

    pageNumber() {
      return Math.ceil(this.logs.length / this.limitLogs) - 1;
    },
  },

  created() {
    this.getLogs();
  },

  methods: {
    getLogs(current, goto) {
      const query = {
        current,
        goto,
        container_name: 'dev-1-java-demo-app',
      };
      this.loading.logs = true;
      AppService.listPodLogs(
        this.zone.id,
        this.space.id,
        'dev-1-java-demo-app-54d668c9c4-4v694',
        'dev-1-java-demo-app',
        query,
      )
        .then(logs => {
          this.handleListLogs(logs);
        })
        .finally(() => {
          this.loading.logs = false;
        });
    },

    handleListLogs(podLogs) {
      const { current, logs } = podLogs;

      this.current = current;
      if (logs === null) {
        this.logs = [];
        this.currentLogs = [];
      } else {
        this.logs = logs.map(item => item._source.message);
      }
      this.pagination = new Pagination(this.logs, this.limitLogs, 0);
      this.currentLogs = this.pagination.gotoPage(0);
    },
    // 上一页
    prePage() {
      console.log(this.pagination.tPage);
      if (this.pagination.tPage === 1) {
        // this.getLogs(this.current, 'older');
        this.btnVisable = true;
      }
      this.currentLogs = this.pagination.prev();
    },
    // 下一页
    nextPage() {
      console.log(this.pagination.tPage === this.pageNumber);
      if (this.pagination.tPage === this.pageNumber - 1) {
        // this.getLogs(this.current, 'newer');
        this.btnVisable = true;
      }
      this.currentLogs = this.pagination.next();
    },
  },
};
</script>

<style lang="scss">
::-webkit-scrollbar {
/*隐藏滚轮*/
  display: none;
}
.console-container {
  background: #3D444F;
  height: 100vh;
  overflow: hidden;
  .header {
    height: 50px;
    background: #fff;
    .left-title {
      float: left;
      padding-left: 20px;
      line-height: 50px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #3D444F;
    }
    .fresh-btn {
      float: right;
      margin: 10px 20px 0 0;
    }
    .download-btn {
      float: right;
      margin: 10px 10px 0;
      width: 100px;
    }
    .search {
      float: right;
      margin-top: 10px;
      input {
        width: 287px;
      }
    }
    .right-title {
      float: right;
      width: 56px;
      line-height: 50px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #3D444F;
    }
  }
  .operation {
    width: 100%;
    z-index: 10;
    height: 72px;
    padding-left: 10px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #E4E7ED;
    .title {
      line-height: 72px;
      padding-left: 10px;
    }
    .dao-select {
      background: #595F69;
      .dao-select-switch {
        border: 1px solid #595F69;
        color: #fff;
      }
    }
    .right-container {
      float: right;
      margin-right: 20px;
      .el-date-editor {
        width: 530px;
        height: 32px;
        background: #595F69;
        border: 1px solid #595F69;
        .el-input__icon {
          margin-bottom: 5px;
        }
        input {
          background: #595F69;
          color: #E4E7ED;
        }
        .el-range-separator {
          color: #E4E7ED;
          margin-bottom: 5px;
        }
      }
    }
  }
  .code-container {
    overflow: hidden;
    height: 100%;
    .code {
      height: 100%;
      padding-bottom: 160px;
      overflow-x: hidden;
      overflow-y: scroll;
      .line {
        height: 17px;
        line-height: 17px;
        padding: 0 20px;
        width: 100%;
        &:hover {
          background: rgba(155, 163, 175, 0.2);
        }
      }
      .codeNumber {
        display: inline-block;
        width: 22px;
        font-family: Consolas;
        font-size: 12px;
        color: #9BA3AF;
        text-align: right;
      }
      .instance {
        display: inline-block;
        width: 50px;
      }
      .codeText {
        display: inline-block;
        margin: 0;
        padding-left: 22px;
        white-space: pre-wrap;
        word-break: normal;
        font-family: Consolas;
        font-size: 12px;
        color: #FFFFFF;
      }
    }
    .touch {
      position: absolute;
      bottom: 20px;
      right: 20px;
      width: 64px;
      height: 32px;
      icon-box {
        width: 32px;
        height: 32px;
        /* svg {
          transform: rotate(90deg)
        } */
      }
    }
  }
}
</style>
