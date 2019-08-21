<template>
  <div>
    <template v-if="!loadings.page">

      <resource-header :resource="resource"></resource-header>

      <div class="dao-view-main">
        <div class="dao-view-content">
          <div class="table-toolbar">
            <div class="table-toolbar-left">
              <button
                class="dao-btn blue has-icon"
                v-if="$can('create')"
                @click="createInstance()">
                <svg class="icon">
                  <use xlink:href="#icon_plus-circled"></use>
                </svg>
                <span class="text">创建</span>
              </button>
            </div>
            <div class="table-toolbar-right">
              <div>
                <dao-input
                  v-model="filterKey"
                  search
                  placeholder="请输入PVC的名称搜索">
                </dao-input>
                <button
                  class="dao-btn"
                  style="margin-left: 10px;"
                  :disabled="loadings.table"
                  @click="getVolumes">
                  <svg class="icon">
                    <use xlink:href="#icon_update"></use>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <el-table
            v-loading="loadings.table"
            :data="pvcsInCurrentPage"
            style="width: 100%">
            <el-table-column
              prop="name"
              label="名称"
              sortable
              min-width="180">
              <template slot-scope="{ row: pvc }">
                <el-table-name-cell
                  :resource="pvc"
                  routerName="resource.persistentvolumeclaims.detail">
                </el-table-name-cell>
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
            :disabled="loadings.table"
            :page-sizes="[ 10, 30, 50 ]"
            :page-size.sync="pageSize"
            :current-page.sync="currentPage"
            layout="sizes, prev, pager, next"
            :total="totalPages">
          </el-pagination>

        </div>
      </div>

    </template>

    <circle-loading v-else></circle-loading>
  </div>
</template>

<script src="./_volume-list.js">
</script>
