<template>
  <div>
    <div class="table-toolbar">
      <div class="table-toolbar-right">
        <dao-input
          v-model="filterKey"
          search
          placeholder="请输入搜索内容">
        </dao-input>
        <button
          class="dao-btn"
          style="margin-left: 10px;"
          @click="loadHistory">
          <svg class="icon">
            <use xlink:href="#icon_update"></use>
          </svg>
        </button>
      </div>
    </div>

    <el-table
      :data="historiesInCurrentPage"
      style="width: 100%"
      :default-sort="{prop: 'metadata.creationTimestamp', order: 'descending'}"
    >
      <!-- SECTION version -->
      <el-table-column label="版本">
        <template slot-scope="{ row: replicaSet}">
          #{{ replicaSet | annotation('deployment.kubernetes.io/revision') }}
          {{ isLastRevision(replicaSet) ? '(当前版本)' : '' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="metadata.name"
        label="名称">
        <template slot-scope="{ row: replicaSet }">
          {{replicaSet.metadata.name}}
        </template>
      </el-table-column>
      <el-table-column
        prop="history.status.replicas"
        label="Replicas">
        <template slot-scope="{ row: replicaSet }">{{replicaSet.status.replicas}}</template>
      </el-table-column>
      <el-table-column prop="address" label="创建时间">
        <template slot-scope="{ row: replicaSet }">
          {{replicaSet.metadata.creationTimestamp | date}}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="180">
        <template
          v-if="$can('deployment.update', 'deployment')"
          slot-scope="{ row: replicaSet }">
          <el-button
            type="text"
            size="small"
            @click="onRollback(replicaSet)"
            v-if="!isLastRevision(replicaSet)">回滚
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      :disabled="loadings.deployment"
      :page-sizes="[10,30,50]"
      :page-size.sync="pageSize"
      :current-page.sync="currentPage"
      layout="sizes, prev, pager, next"
      :total="totalPages">
    </el-pagination>

    <yaml-preview-dialog
      :value="preview.history"
      confirmText="preview.isLatest ? '确定' : '回滚'"
      :header="preview.header"
      :visible.sync="preview.open"
      @confirm="onRollback(preview.formatedHistory, preview.isLatest)"
      @close="resetPreviewDialog"
    ></yaml-preview-dialog>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import DeploymentResourceService from '@/core/services/deployment.resource.service';
import YAMLPreviewDialog from '@/view/components/yaml-preview-dialog/yaml-preview-dialog';
import { chunk, nth } from 'lodash';

export default {
  name: 'HistoryPanel',
  components: { 'yaml-preview-dialog': YAMLPreviewDialog },
  created() {
    this.loadHistory();
  },
  props: {
    deployment: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const { name: deploymentName } = this.$route.params;
    return {
      preview: {
        history: {},
        open: false,
        formatedHistory: {},
        header: '',
        isLatest: false,
      },
      histories: [], // NOTE history 也是 replicationConfig
      loadings: {
        page: true,
        deployment: false,
      },
      filterKey: '',
      deploymentName,
      currentPage: 1,
      pageSize: 10,
    };
  },
  computed: {
    ...mapState(['space', 'zone']),
    formatedHistories() {
      return this.histories
        .map(h => {
          return {
            ...h,
            deploymentVersion: Number.parseInt(
              this.annotationFormat(h, 'deploymentVersion'),
              10,
            ),
            origin: h,
          };
        })
        .sort((a, b) => {
          return (
            new Date(b.metadata.creationTimestamp) -
            new Date(a.metadata.creationTimestamp)
          );
        });
    },

    filteredHistories() {
      return this.formatedHistories.filter(h => {
        const key = this.filterKey.toLowerCase();
        const inName = h.metadata.name.toLowerCase().includes(key);
        const inLabel =
          h.metadata.labels &&
          Object.values(h.metadata.labels).some(v =>
            v.toLowerCase().includes(key));
        return inName || inLabel;
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
    isLastRevision(replicaSet) {
      return (
        this.deploymentVersion(replicaSet) === this.lastDeploymentRevision()
      );
    },

    deploymentVersion(replicaSet) {
      return `#${Vue.filter('annotation')(
        replicaSet,
        'deployment.kubernetes.io/revision',
      )}`;
    },

    lastDeploymentRevision() {
      return Vue.filter('last_deployment_revision')(this.deployment);
    },

    annotationFormat(resource, key) {
      return Vue.filter('annotation')(resource, key);
    },

    loadHistory() {
      this.loadings.deployment = true;
      DeploymentResourceService.getHistory(
        this.space.id,
        this.zone.id,
        this.deploymentName,
      )
        .then(res => {
          this.histories = res.items;
        })
        .finally(() => {
          this.loadings.deployment = false;
        });
    },

    onRollback(replicaSet, isLatest) {
      if (isLatest) return;
      this.$tada
        .confirm({
          title: '回滚',
          text: `您确定要回滚到 #${Vue.filter('annotation')(
            replicaSet,
            'deployment.kubernetes.io/revision',
          )} 版本吗？`,
          primaryText: '确定',
          primaryLevel: 'success',
        })
        .then(ok => {
          if (ok) {
            this.loadings.page = true;
            DeploymentResourceService.rollback(
              this.space.id,
              this.zone.id,
              this.deploymentName,
              Vue.filter('annotation')(
                replicaSet,
                'deployment.kubernetes.io/revision',
              ),
            )
              .then(res => {
                this.$emit('rollback', res);
              })
              .finally(() => {
                this.loadHistory();
              });
          }
        });
    },

    resetPreviewDialog() {
      this.preview = {
        history: {},
        open: false,
        formatedHistory: {},
        header: '',
      };
    },
  },
};
</script>
