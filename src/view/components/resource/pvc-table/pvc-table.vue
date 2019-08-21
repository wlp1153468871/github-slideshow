<template>
  <div class="pvc-table">
    <div class="table-toolbar">
      <div class="table-toolbar-right">
        <div>
          <dao-input
            v-model="filterKey"
            search
            placeholder="请输入PVC的名称搜索">
          </dao-input>
        </div>
      </div>
    </div>

    <el-table
      v-loading="loading"
      :data="pvcsInCurrentPage"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="名称"
        sortable
        min-width="180">
        <template slot-scope="{ row: pvc}">
          <router-link
            :to="{
                    name: 'resource.persistentvolumeclaims.detail',
                    params: { name: pvc.metadata.name }
                  }">
            {{ pvc.metadata.name }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        min-width="300px">
        <template slot-scope="{ row: pvc}">
          <status-icon :status="pvc.status.phase"></status-icon>
          {{pvc.status.phase}}
          <span v-if="pvc.spec.volumeName">
                  to volume <strong>{{pvc.spec.volumeName}}</strong>
                </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="storage"
        label="存储量"
        sortable
        :sort-method="sortStorage"
        min-width="100">
        <template slot-scope="{ row: pvc }">
          <template v-if="pvc.spec.volumeName">
            <template v-if="pvc.status.capacity.storage">
              {{ pvc.status.capacity.storage | usage_with_units('storage') }}
            </template>
          </template>
          <template v-else>
            未知
          </template>
        </template>
      </el-table-column>
      <el-table-column
        prop="accessModes"
        label="读取模式"
        min-width="120px">
        <template slot-scope="{ row: pvc }">
          {{ pvc.spec.accessModes | access_modes }}
        </template>
      </el-table-column>
      <el-table-column
        prop="creationTimestamp"
        label="创建时间"
        sortable
        :sort-method="sortCreationTime"
        min-width="200px">
        <template slot-scope="{ row: pvc }">
          {{ pvc.metadata.creationTimestamp | date }}
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      :disabled="loading"
      :page-sizes="[ 10, 30, 50 ]"
      :page-size.sync="pageSize"
      :current-page.sync="currentPage"
      layout="sizes, prev, pager, next"
      :total="totalPages">
    </el-pagination>
  </div>
</template>

<script>
import { chunk, nth, get as getValue } from 'lodash';
import { mapState } from 'vuex';
import convert from 'convert-units';

export default {
  name: 'pvc-table',

  props: {
    pvcs: { type: Array, default: () => [] },
    loading: { type: Boolean, default: true },
  },

  data() {
    return {
      filterKey: '',
      currentPage: 1,
      pageSize: 10,
    };
  },

  computed: {
    ...mapState(['space', 'zone', 'user']),

    pvcFilteredByKey() {
      const filterKey = this.filterKey.toLowerCase();
      return this.pvcs.filter(volume =>
        volume.metadata.name.toLowerCase().includes(filterKey));
    },

    paginaPvcs() {
      return chunk(this.pvcFilteredByKey, this.pageSize);
    },

    pvcsInCurrentPage() {
      return nth(this.paginaPvcs, this.currentPage - 1);
    },

    totalPages() {
      return this.pvcFilteredByKey.length;
    },
  },

  methods: {
    gotoDetail(volume) {
      this.$router.push({
        name: 'resource.persistentvolumeclaims.detail',
        params: {
          name: volume.metadata.name,
        },
      });
    },

    // TODO: 这个排序是基于单位统一成MB的排序结果
    sortStorage(prev, next) {
      return this.unifyStorageUnit(next) - this.unifyStorageUnit(prev);
    },

    sortCreationTime(prev, next) {
      const prevTime = getValue(prev, 'metadata.creationTimestamp');
      const nextTime = getValue(next, 'metadata.creationTimestamp');
      if (prevTime === nextTime) {
        return 0;
      } else if (prevTime > nextTime) {
        return 1;
      }
      return -1;
    },

    unifyStorageUnit(storage) {
      const storageWithUnit = getValue(storage, 'status.capacity.storage');
      if (storageWithUnit) {
        const split = /(-?[0-9.]+)\s*(.*)/.exec(storageWithUnit);
        const amount = split[1];
        const unit = `${split[2]}B`;
        return convert(amount)
          .from(unit)
          .to('MB');
      }
      return 0;
    },
  },
};
</script>
