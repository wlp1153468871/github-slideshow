<template>
  <div id="allInstances">
    <div class="header">实例列表</div>
    <dao-input
      search
      v-model="key"
      @change="updateKey"
      placeholder="搜索"
      class="search"
    >
    </dao-input>
    <span class="fresh" @click="fresh">
      <button class="dao-btn icon-btn" style="margin-left: 10px;" @click="fresh()">
        <svg class="icon"><use xlink:href="#icon_cw"></use></svg>
      </button>
    </span>
    <div class="table">
      <el-table
        style="width: 100%;"
        :data="instances"
        v-loading="loading.instance"
      >
        <el-table-column label="实例名称" width="250">
          <template slot-scope="scope">
            <div style="color: #217EF2;cursor: pointer;" @click="rowClick(scope.row.id)">
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所属应用">
          <template slot-scope="scope">
            <div v-if="scope.row.available === '1'">
              {{scope.row.appName}}
            </div>
            <div v-else>
              {{scope.row.appName}}(已禁用)
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Chart 版本" prop="chartVersion" width="150"></el-table-column>
        <el-table-column label="状态" width="150">
          <template slot-scope="scope">
            <svg class="icon" :class="stateClass(scope.row.status)">
              <use :xlink:href="`#icon_status-dot-small`"></use>
            </svg>
            <span>{{ scope.row.status | ops_status }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建者" prop="ownerName"></el-table-column>
        <el-table-column label="创建时间" >
          <template slot-scope="scope">
            {{ scope.row.createdAt | unix_date('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <div class="page">共 {{instanceNum()}} 项</div>
        <el-pagination
          v-if="total"
          :page-sizes="[10, 15, 20, 25]"
          :page-size="100"
          :current-page.sync="currentPage"
          layout="sizes, prev, pager, next"
          style="padding-top: 5px;"
          @size-change="changeSize"
          @current-change="handleCurrentChange"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script src="./all-instance.js"></script>
<style lang="scss" src='./all-instance.scss' scoped></style>
