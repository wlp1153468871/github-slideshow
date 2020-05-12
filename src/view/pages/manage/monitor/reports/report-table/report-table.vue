<template>
  <div id="monitor-report-table">
    <div class="table-toolbar">
      <div class="table-toolbar-left table-title">
        <slot name="title"></slot>
      </div>
      <div class="table-toolbar-right">
        <dao-input
          search
          v-model.trim="searchKey"
          :disabled="loading"
          :placeholder="placeholder"
          @keyup.enter="onSearch"
        >
        </dao-input>
      </div>
    </div>
    <el-table :data="currentKindMap" v-loading="loading">
      <el-table-column prop="name" label="name"> </el-table-column>
      <el-table-column prop="cpuMax" label="cpu max (core)"> </el-table-column>
      <el-table-column prop="cpuLimit" label="cpu limit (core)"> </el-table-column>
      <el-table-column prop="memMax" label="mem max (M)"> </el-table-column>
      <el-table-column prop="memLimit" label="mem limit (M)"> </el-table-column>
    </el-table>
    <div class="block note-part">
      <el-pagination
        background
        layout="prev, pager, next, total"
        :total="kindMap.length"
        :page-size="pageSize"
        :current-page.sync="currentPage"
      >
      </el-pagination>
      <slot name="note"></slot>
    </div>
  </div>
</template>
<script src="./report-table.js"></script>
<style lang="scss">
@import './report-table';
</style>
