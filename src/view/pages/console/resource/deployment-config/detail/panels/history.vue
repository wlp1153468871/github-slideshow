<template>
  <div>
    <div class="action-area">
      <div></div>
      <div>
        <dao-input v-model="filterKey" search placeholder="请输入搜索内容"> </dao-input>
        <button class="dao-btn" style="margin-left: 10px;" @click="loadHistory">
          <svg class="icon">
            <use xlink:href="#icon_update"></use>
          </svg>
        </button>
      </div>
    </div>
    <el-table
      :data="historiesInCurrentPage"
      style="width: 100%;"
      v-loading="loading"
      :default-sort="{ prop: 'metadata.creationTimestamp', order: 'descending' }"
    >
      <!-- SECTION version -->
      <el-table-column label="版本">
        <template slot-scope="{ row: history }">
          <span v-if="history.deploymentVersion">
            <a @click="onPreview(history)">#{{ history.deploymentVersion }}</a>
            <span v-if="dc.status.latestVersion === history.deploymentVersion">(latest)</span>
          </span>
        </template>
      </el-table-column>
      <!-- !SECTION  -->
      <!-- SECTION status -->
      <el-table-column prop="metadata.name" label="状态">
        <template slot-scope="{ row: history }">
          <status-icon :status="history.deploymentStatus"></status-icon>
          <span class="status-detail">
            {{ history.deploymentStatus }}
            <span
              v-if="history.deploymentStatus == 'Active' || history.deploymentStatus == 'Running'"
            >
              ,
              <span v-if="history.spec.replicas !== history.status.replicas">
                {{ history.status.replicas }}/
              </span>
              {{ history.spec.replicas }}
              <span>replica</span>
              <span v-if="history.spec.replicas != 1">s</span>
            </span>
          </span>
        </template>
      </el-table-column>
      <!-- !SECTION  -->
      <!-- SECTION causes -->
      <el-table-column prop="name" label="Trigger">
        <template slot-scope="{ row: history }">
          <span v-if="!history.causes.length">Unknown</span>
          <span v-if="history.causes.length">
            <span v-for="(cause, i) in history.causes" :key="i">
              <span v-if="cause.type === 'ImageChange'">
                <span v-if="cause.imageTrigger.from">
                  <abbr :title="cause.imageTrigger.from | imageObjectRef(null, true)">Image</abbr>
                  change
                </span>
              </span>
              <span v-else-if="cause.type === 'ConfigChange'">Config change</span>
              <span v-else>{{ cause.type }}</span>
            </span>
          </span>
        </template>
      </el-table-column>
      <!-- !SECTION -->
      <!-- SECTION creatTime -->
      <el-table-column prop="address" label="创建时间">
        <template slot-scope="{ row: history }">
          {{ history.metadata.creationTimestamp | date }}
        </template>
      </el-table-column>
      <!-- !SECTION  -->

      <!-- SECTION opt -->
      <el-table-column fixed="right" label="操作" width="180">
        <template #default="{ row: rc }">
          <el-button
            v-if="$can('update') && dc.status.latestVersion !== rc.deploymentVersion"
            type="text"
            size="small"
            @click="onRollback(rc)"
            >回滚
          </el-button>
          <el-button type="text" size="small" @click="onCheckEvents(rc)">查看事件 </el-button>
        </template>
      </el-table-column>
      <!-- !SECTION  -->
    </el-table>

    <dao-dialog
      :size="{ width: '1000px' }"
      :visible.sync="events.show"
      :footer="false"
      :header="{
        title: '历史版本RC事件',
        showClose: true,
      }"
      @close="events.show = false"
    >
      <events-table @refresh="getHistoryEvents" :events="events.data" :loading="events.loading">
      </events-table>
    </dao-dialog>
    <!-- SECTION preview -->
    <yaml-preview-dialog
      :value="preview.history"
      :confirmText="preview.isLatest ? '确定' : '回滚'"
      :header="preview.header"
      :visible.sync="preview.open"
      @confirm="onRollback(preview.formatedHistory, preview.isLatest)"
      @close="resetPreviewDialog"
    ></yaml-preview-dialog>
    <el-pagination
      background
      :disabled="loading"
      :page-sizes="[10, 30, 50]"
      :page-size.sync="pageSize"
      :current-page.sync="currentPage"
      layout="sizes, prev, pager, next"
      :total="totalPages"
    >
    </el-pagination>
    <!-- !SECTION  -->
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { chunk, nth, get } from 'lodash';

import DCService from '@/core/services/deployment-config.service.ts';
import YAMLPreviewDialog from '@/view/components/yaml-preview-dialog/yaml-preview-dialog.vue';

export default {
  name: 'HistoryPanel',
  components: { 'yaml-preview-dialog': YAMLPreviewDialog },
  created() {
    this.loadHistory();
  },
  props: {
    dc: {
      type: Object,
      default: () => ({}),
    },
    name: String,
  },
  data() {
    return {
      preview: {
        history: {},
        open: false,
        formatedHistory: {},
        header: '',
        isLatest: false,
      },
      histories: [], // NOTE history 也是 replicationConfig
      // filteredHistories: [],
      loading: false,
      filterKey: '',
      currentPage: 1,
      pageSize: 10,
      events: {
        data: [],
        loading: false,
        show: false,
        name: '',
      },
    };
  },
  computed: {
    ...mapState(['space', 'zone']),
    formatedHistories() {
      return this.histories
        .map(h => {
          return {
            ...h,
            causes: this.causeFormat(h),
            deploymentVersion: Number.parseInt(this.annotationFormat(h, 'deploymentVersion'), 10),
            deploymentStatus: this.deploymentStatusFormat(h),
            origin: h,
          };
        })
        .sort((a, b) => {
          return new Date(b.metadata.creationTimestamp) - new Date(a.metadata.creationTimestamp);
        });
    },
    filteredHistories() {
      return this.formatedHistories.filter(h => {
        const key = this.filterKey.toLowerCase();
        return h.deploymentVersion.toString().toLowerCase().includes(key);
      });
    },
    viewHistories() {
      return this.filteredHistories;
    },
    paginaHistories() {
      return chunk(this.filteredHistories, this.pageSize);
    },

    historiesInCurrentPage() {
      return nth(this.paginaHistories, this.currentPage - 1);
    },

    totalPages() {
      return this.filteredHistories.length;
    },
  },
  methods: {
    // SECTION formats
    annotationFormat(resource, key) {
      return this.$options.filters.annotation(resource, key);
    },
    deploymentStatusFormat(history) {
      if (this.annotationFormat(history, 'deploymentCancelled')) {
        return 'Cancelled';
      }

      const status = this.annotationFormat(history, 'deploymentStatus');
      if (status === 'Complete' && history.spec.replicas > 0) {
        return 'Active';
      }

      return status;
    },
    causeFormat(history) {
      if (!history) {
        return [];
      }

      const configJson = this.annotationFormat(history, 'encodedDeploymentConfig');
      if (!configJson) {
        return [];
      }

      try {
        const depConfig = JSON.parse(configJson);
        if (!depConfig) {
          return [];
        }
        const causes = get(depConfig, 'status.details.causes');
        return causes || [];
      } catch (e) {
        console.error('Failed to parse encoded deployment config', e);
        return [];
      }
    },
    // !SECTION

    // SECTION fetch
    loadHistory() {
      this.loading = true;
      DCService.getHistoryList(this.space.id, this.zone.id, this.name)
        .then(res => {
          this.histories = res.items;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // !SECTION

    // SECTION events
    onPreview(history) {
      this.preview = {
        history: history.origin,
        formatedHistory: history,
        open: true,
        isLatest: this.dc.status.latestVersion === history.deploymentVersion,
        header: get(history, 'metadata.name'),
      };
    },
    onRollback(history, isLatest) {
      if (isLatest) return;
      this.$tada
        .confirm({
          title: '回滚',
          primaryText: '确认',
          text: `您确定要回滚到 #${history.deploymentVersion} 版本吗？`,
        })
        .then(ok => {
          if (ok) {
            this.loading = true;
            DCService.rollbackToHistoryVersion(
              this.space.id,
              this.zone.id,
              this.name,
              history.deploymentVersion,
            )
              .then(res => {
                this.$emit('rollback', res);
              })
              .finally(() => {
                this.loading = false;
              });
          }
        });
    },
    // !SECTION

    // SECTION others
    resetPreviewDialog() {
      this.preview = {
        history: {},
        open: false,
        formatedHistory: {},
        header: '',
      };
    },
    // !SECTION
    getHistoryEvents() {
      this.events.loading = true;
      DCService.getHistoryEvents(this.space.id, this.zone.id, this.events.name)
        .then(res => {
          this.events.data = res.items || [];
        })
        .finally(() => {
          this.events.loading = false;
        });
    },

    onCheckEvents(rc) {
      this.events.show = true;
      this.events.name = rc.metadata.name;
      this.$nextTick(() => {
        this.getHistoryEvents();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
// TODO lift common style
.action-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;

  .selection-info {
    margin-left: 10px;
    font-size: 13px;
    color: #333;
  }
}
</style>
