<template>
  <div id="zone">
    <div class="header">可用区管理</div>
    <dao-input
      search
      placeholder="搜索"
      class="search"
    >
    </dao-input>
    <span class="fresh">
      <el-button size="mini" style="margin-left: 10px;" >
        <span>
          <svg class="icon">
            <use :xlink:href="`#icon_cw`"></use>
          </svg>
        </span>
      </el-button>
    </span>
    <div class="table">
      <el-table
        :data="zoneList"
        :cell-style="nameStyle"
        @cell-click="cellClick"
      >
        <el-table-column label="可用区名称"
                         prop="name"
                         width="250"
                         style="color: #217EF2"></el-table-column>
        <el-table-column label="集群地址" prop="clusterUrl" width="250"></el-table-column>
        <el-table-column label="chart仓库地址" prop="chartRepo" width="180"></el-table-column>
        <el-table-column label="状态" width="180">
          <template slot-scope="props">
            <svg class="icon" style="color: #25D473">
              <use :xlink:href="`#icon_status-dot-small`"></use>
            </svg>
            <span>{{props.row.status}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.createdAt | unix_date('YYYY/MM/DD HH:mm:ss') }}
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <el-pagination
          class="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage2"
          :page-sizes="[10, 15, 20, 25]"
          :page-size="10"
          layout="sizes, prev, pager, next"
          :total="zoneList.length">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script src="./zone.js"></script>

<style lang="scss" src="./zone.scss" scoped></style>
