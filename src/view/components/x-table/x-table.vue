<template>
  <div class="x-table">
    <div class="table-toolbar">
      <div class="table-toolbar-left">
        <slot name="operation"></slot>
      </div>
      <div class="table-toolbar-right">
        <div>
          <dao-input
            search
            v-model="filterKey"
            placeholder="请输入搜索内容">
          </dao-input>
          <button
            class="dao-btn"
            style="margin-left: 10px;"
            @click="$emit('refresh')">
            <svg class="icon">
              <use xlink:href="#icon_update"></use>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <el-table
      v-bind="$attrs"
      v-loading="loading"
      :data="dataInCurrentPage">
      <slot></slot>
    </el-table>

    <el-pagination
      background
      :page-sizes="[10,30,50]"
      :page-size.sync="pageSize"
      :current-page.sync="currentPage"
      layout="sizes, prev, pager, next"
      :total="totalPages">
    </el-pagination>
  </div>
</template>

<script src="./_x-table.js">
</script>
