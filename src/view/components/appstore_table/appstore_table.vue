<template>
  <div class="appstore_table">
    <div class="table-header">
      <slot></slot>
    </div>
    <el-table
      v-loading="loading"
      :data="paginate ? dataInCurrentPage : dataFilteredByKey"
    >
      <slot></slot>
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
</template>

<script src="./appstore_table.js"></script>