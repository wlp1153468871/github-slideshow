<template>
  <div class="x-table">
    <div class="table-toolbar">
      <div class="table-toolbar-left">
        <slot name="operation"></slot>
      </div>
      <div
        class="table-toolbar-right"
        v-if="filterMethod || showRefresh"
      >
        <div style="display: flex;justify-content: center;align-items: center;">
          <!-- <dao-input
            search
            v-model="filterKey"
            :placeholder="searchPlaceholder">
          >
          </dao-input>
          <button
            v-if="showRefresh"
            class="dao-btn"
            style="margin-left: 10px;"
            @click="$emit('refresh')"
          >
            <svg class="icon">
              <use xlink:href="#icon_update"></use>
            </svg>
          </button> -->
          <el-input
            style="width: 200px;"
            size="small"
            v-if="filterMethod"
            v-model="filterKey"
            :placeholder="searchPlaceholder"
            clearable
            prefix-icon="el-icon-search"
          ></el-input>
          <el-button
            v-if="showRefresh"
            @click="$emit('refresh')"
            size="mini"
            style="margin-left: 10px;"
          >
            <svg class="icon">
              <use xlink:href="#icon_update"></use>
            </svg>
          </el-button>
        </div>
      </div>
    </div>

    <el-table
      v-bind="$attrs"
      v-loading="loading"
      :data="paginate ? dataInCurrentPage : dataFilteredByKey"
      :empty-text="emptyText"
    >
      <slot></slot>
    </el-table>

    <el-pagination
      v-if="paginate"
      background
      :small="small"
      :page-sizes="[10,30,50]"
      :page-size.sync="pageSize"
      :current-page.sync="currentPage"
      :layout="small ? `prev, pager, next` : 'sizes, prev, pager, next'"
      :total="totalPages"
    >
    </el-pagination>
  </div>
</template>

<script src="./_x-table.js">
</script>
