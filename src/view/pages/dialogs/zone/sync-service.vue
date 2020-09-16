<template>
  <dao-dialog
    class="sync-catalog-dialog"
    :header="type === 'catalog' ? '同步服务目录' : '同步Broker'"
    :closeOnPressEscape="false"
    :visible.sync="isShow"
    @before-open="init"
    @opened="sync"
    @before-close="destroyed"
  >
    <div class="sync-progress" v-if="syncStatus === SYNC_STATUS.SYNCING">
      <dao-progress-pulsing :progress="syncProgress"></dao-progress-pulsing>
      <span>{{ Math.round(syncProgress * 100) }}%</span>
    </div>

    <div
      class="sync-log-panel"
      v-if="syncStatus === SYNC_STATUS.SYNCING"
      ref="logPanel"
      @mousewheel.passive="toggleScrollWheel"
    >
      <p v-for="(log, index) in logs" :key="index">
        {{ log.actionTime | unix_date }} | {{ log.message }}
      </p>
      <i class="reverse-video terminal-cursor"></i>
    </div>

    <div class="sync-success" v-if="syncStatus === SYNC_STATUS.SUCCESS">
      <img :src="successImg" alt="服务同步成功" />
      <p class="hint-title">{{ type === 'catalog' ? '服务同步已完成' : 'Broker同步已完成' }}</p>
      <p class="hint-desc">
        你现在可以前往
        <router-link
          :to="{
            name: 'manage.service.list',
          }"
        >
          服务管理
        </router-link>
        查看已同步的服务
      </p>
    </div>

    <div slot="footer">
      <button :disabled="!canClose" class="dao-btn white" @click="$emit('close')">
        关闭
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import CatalogService from '@/core/services/catalog.service';
import BrokerService from '@/core/services/broker.service';
import successImg from '@/assets/images/success.png';
import { SYNC_STATUS } from '@/core/constants/constants';

export default {
  name: 'SyncServiceDialog',
  props: {
    visible: Boolean,
    broker: Object,
    zone: {
      required: true,
      type: Object,
    },
    isSyncing: {
      type: Boolean,
    },
    type: {
      type: String,
      required: true,
      validator: value => {
        return ['catalog', 'broker'].indexOf(value) !== -1;
      },
    },
  },

  data() {
    return {
      logs: [],
      successImg,
      SYNC_STATUS,
      syncProgress: 0,
      syncService: null,
      syncStatus: SYNC_STATUS.SYNCING,
      syncTimer: null,
      canClose: false,
      wheelScroll: false,
    };
  },

  methods: {
    toggleScrollWheel() {
      this.wheelScroll = true;
      const { logPanel } = this.$refs;
      if (logPanel) {
        if (logPanel.scrollHeight - logPanel.scrollTop <= logPanel.clientHeight) {
          this.wheelScroll = false;
        }
      }
    },

    init() {
      if (this.isSyncing) return;
      if (this.type === 'catalog') {
        this.syncService = CatalogService.syncCatalog(this.zone.id);
      } else {
        this.syncService = BrokerService.syncBroker(this.zone.id, this.broker.id);
      }
    },

    sync() {
      if (this.isSyncing) {
        this.getLogs();
        return;
      }
      this.syncService
        .then(() => {
          this.getLogs();
        })
        .catch(e => {
          this.$emit('error', e);
          this.$noty.error('同步服务失败！');
        });
    },

    getLogs() {
      if (this.type === 'catalog') {
        CatalogService.getCatalogLogs(this.zone.id).then(data => {
          if (data.status === SYNC_STATUS.FAIL) {
            this.$noty.error('同步可用区失败！');
            this.canClose = true;
            return;
          }
          this.addLogs(data);
        });
      } else {
        BrokerService.getBrokerLogs(this.zone.id, this.broker.id).then(data => {
          if (data.status === SYNC_STATUS.FAIL) {
            this.$noty.error('同步broker失败！');
            this.canClose = true;
            return;
          }
          this.addLogs(data);
        });
      }
    },

    addLogs(data) {
      this.logs = data.logs;
      this.syncProgress = data.percent;
      if (data.percent < 1) {
        this.syncTimer = setTimeout(() => {
          this.getLogs();
        }, 1000);
      } else if (data.percent === 1) {
        setTimeout(() => {
          this.syncStatus = SYNC_STATUS.SUCCESS;
          this.canClose = true;
        }, 2000);
      }
    },

    destroyed() {
      this.syncService = null;
      this.syncProgress = 0;
      this.logs = [];
      this.canClose = false;
      this.syncStatus = SYNC_STATUS.SYNCING;
      this.wheelScroll = false;
    },
  },

  updated() {
    const { logPanel } = this.$refs;
    if (this.wheelScroll) return;
    if (logPanel) logPanel.scrollTop = logPanel.scrollHeight - logPanel.clientHeight;
  },

  computed: {
    isShow: {
      set(val) {
        this.$emit('close', val);
      },
      get() {
        return this.visible;
      },
    },
  },

  destroyed() {
    clearTimeout(this.syncTimer);
  },
};
</script>

<style lang="scss">
@import '~daoColor';

.sync-catalog-dialog {
  .router-link {
    color: $blue;
    cursor: pointer;
  }

  .dao-dialog-body {
    padding: 15px 20px 20px;
  }
  .sync-success {
    text-align: center;
    vertical-align: top;
    img {
      width: 100px;
      height: 100px;
      margin-top: 45px;
      vertical-align: top;
    }
    p {
      line-height: 24px;
    }
    .hint-title {
      margin-top: 30px;
      font-size: 20px;
      color: #3d444f;
      font-weight: 700;
      line-height: 28px;
    }
    .hint-desc {
      margin-top: 8px;
      margin-bottom: 45px;
    }
  }

  .sync-progress {
    font-size: 12px;
    display: flex;
    align-items: center;
    line-height: 17px;
    span {
      word-break: break-all;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 41px;
      text-align: right;
    }
  }
  .sync-log-panel {
    height: 248px;
    margin-top: 15px;
    border-radius: 4px;
    line-height: 24px;
    background: #1f2126;
    padding: 10px 15px;
    overflow: auto;
    p {
      color: #fff;
      line-height: 24px;
    }
  }
}

.terminal-cursor {
  height: 22px;
  width: 5px;
  display: inline-block;
  border-right: 0.15em solid $blue;
  animation: blink-caret 0.75s step-end infinite;
}

@keyframes blink-caret {
  from,
  to {
    border-color: transparent;
  }
  50% {
    border-color: $blue;
  }
}
</style>
