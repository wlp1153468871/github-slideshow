<template>
  <div class="pod-table">
    <div class="table-toolbar">
      <div class="table-toolbar-left">
        <template v-if="deleteable">
          <button
            class="dao-btn dao-sm red delete"
            @click="$emit('remove', multipleSelection)"
            :disabled="!multipleSelection.length"
          >
            <svg class="icon">
              <use xlink:href="#icon_trash"></use>
            </svg>
            删除
          </button>
          <span class="selection-info">
            共 {{ pods.length }} 个 容器组, 已选择 {{ multipleSelection.length }} 个
          </span>
        </template>
      </div>
      <div class="table-toolbar-right">
        <div style="display: flex; justify-content: center; align-items: center;">
          <el-input
            style="width: 200px;"
            size="small"
            v-model="filterKey"
            placeholder="请输入搜索内容"
            clearable
            prefix-icon="el-icon-search"
          ></el-input>
          <el-button
            v-if="canRefresh"
            size="mini"
            style="margin-left: 10px;"
            :disabled="loading"
            @click="$emit('refresh')"
          >
            <svg class="icon">
              <use xlink:href="#icon_update"></use>
            </svg>
          </el-button>
        </div>
      </div>
    </div>

    <el-table
      ref="podTable"
      v-loading="loading"
      :data="podsInCurrentPage"
      row-key="metadata.name"
      @selection-change="handleSelectionChange"
      style="width: 100%;"
    >
      <el-table-column v-if="deleteable" reserve-selection type="selection" width="55">
      </el-table-column>
      <el-table-column min-width="230px" prop="metadata.name" sortable label="容器组">
        <template slot-scope="{ row: pod }">
          <router-link :to="{ name: 'manage.node.detail.pods.detail', params: { podName: pod.metadata.name, namespace: pod.metadata.namespace } }">
            {{ pod.metadata.name }}
          </router-link>
          <span v-if="isDebugPod(pod)">
            <svg class="icon">
              <use xlink:href="#icon_bug"></use>
            </svg>
            <span class="sr-only">Debugging pod {{ pod | debug_pod_source_name }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column min-width="120px" prop="imageVersion" label="镜像版本">
        <template slot-scope="{ row: pod }">
          <span class="status-detail">{{ getImageVersion(pod) }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120px" prop="status" sortable label="状态">
        <template slot-scope="{ row: pod }">
          <status-icon :status="pod | pod_status"></status-icon>
          <!-- eslint-disable-next-line max-len -->
          <span class="status-detail" :class="pod | pod_status">{{ pod | pod_status | humanize_pod_status }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" prop="containersReady" label="运行中">
        <template slot-scope="{ row: pod }">
          {{ pod | num_containers_ready }}/{{ pod.spec.containers.length }}
        </template>
      </el-table-column>
      <el-table-column
        min-width="100px"
        prop="restarts"
        sortable
        :sort-method="sortReStartTimes"
        label="重启次数"
      >
        <template slot-scope="{ row: pod }">
          {{ pod | num_container_restarts }}
        </template>
      </el-table-column>
      <el-table-column
        min-width="200px"
        prop="status.startTime"
        sortable
        :sort-method="sortStartTime"
        label="启动时刻"
      >
        <template #default="{ row: pod }">
          {{ pod.status.startTime | date | otherwise }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="activePods"
        min-width="200px"
        prop="status.traffic"
        label="Receiving Traffic"
      >
        <template #default="{ row: pod }">
          <span v-if="activePods[pod.metadata.name]">
            <svg class="icon text-success mr-xs">
              <use xlink:href="#icon_checkmark-menu-item"></use>
            </svg>
            <span class="sr-only">Yes</span>
          </span>
          <span v-else>
            <el-tooltip placement="top">
              <template #content>
                {{ podFailureReason(pod) }}
              </template>
              <span>
                <svg class="icon text-danger mr-xs" style="cursor: help;">
                  <use xlink:href="#icon_close"></use>
                </svg>
                <span class="sr-only">No</span>
              </span>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      hide-on-single-page
      background
      :disabled="loading"
      :page-sizes="[10, 30, 50]"
      :page-size.sync="pageSize"
      :current-page.sync="currentPage"
      layout="sizes, prev, pager, next"
      :total="totalPages"
    >
    </el-pagination>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import Vue from 'vue';
import { chunk, nth, includes } from 'lodash';
import isDebugPod from '@/view/filters/resource/is-debug-pod.filter';

export default {
  name: 'PodTable',

  props: {
    pods: { type: Array, default: () => [] },
    canSelect: { type: Boolean, default: false },
    canRefresh: { type: Boolean, default: true },
    loading: { type: Boolean, default: true },
    activePods: { type: Object },
  },

  data() {
    return {
      filterKey: '',
      multipleSelection: [],
      currentPage: 1,
      pageSize: 10,
      podFailureReasons: {
        Pending: 'This pod will not receive traffic until all of its containers have been created.',
      },
    };
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

  methods: {
    isDebugPod,

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    podFailureReason(pod) {
      return `${this.podFailureReasons[pod.status.phase] ||
        'This pod has no endpoints and is not accepting traffic.'}`;
    },

    sortReStartTimes(a, b) {
      return Vue.filter('num_container_restarts')(a) - Vue.filter('num_container_restarts')(b);
    },

    getImageVersion(pod) {
      return pod.spec.containers[0].image.split(':')[1];
    },
    sortStartTime(a, b) {
      const prevTime = dayjs(a.status.startTime);
      const nextTime = dayjs(b.status.startTime);
      if (prevTime.isSame(nextTime)) {
        return 0;
      } else if (prevTime.isBefore(nextTime)) {
        return -1;
      }
      return 1;
    },
  },

  watch: {
    pods(pods) {
      const podNames = pods.map(pod => pod.metadata.name);
      this.multipleSelection = this.multipleSelection.filter(({ metadata: { name } }) =>
        includes(podNames, name),
      );
    },
  },
};
</script>

<style lang="scss">
.pod-table {
  .selection-info {
    margin-left: 10px;
    font-size: 13px;
    color: #333;
  }

  .status-detail {
    flex: 1 1 0%;
  }

  .el-table__row{
    .cell{
      .Running, .Ready{
        color: #22c36a;
      }
      .Pending{
        color: #f7b32b;
      }
      .Failed, .Error{
        color: #f1483f;
      }
    }
  }
}
</style>
