<template>
  <div id="metric-table">
    <div class="table-toolbar">
      <div class="table-toolbar-left table-title">
        <slot name="filter">如下指标适用于deployment config，deployment，和statefulset</slot>
      </div>
      <div class="table-toolbar-right">
        <dao-input
          search
          v-model.trim="searchKey"
          :disabled="loading"
          placeholder="搜索 指标名，指标表达式"
          @change="onSearch"
        >
        </dao-input>
      </div>
    </div>
    <el-table :data="currentRulesBasedPage" v-loading="loading">
      <el-table-column prop="name" label="指标名称" v-slot="{ row }">
        {{ row.name || '_' }}
      </el-table-column>
      <el-table-column prop="expr" label="指标表达式" v-slot="{ row }">
        {{ row.expr || '_' }}
      </el-table-column>
      <el-table-column prop="threshold" label="默认阈值" v-slot="{ row }">
        <span>{{ row.threshold.join('') || '_' }}</span>
      </el-table-column>
      <el-table-column prop="for" label="默认持续时间" v-slot="{ row }">
        <span>{{ row.for.join('') || '_' }}</span>
      </el-table-column>
      <el-table-column prop="keyInformation" label="动态模版"> </el-table-column>
    </el-table>
    <div class="block note-part">
      <el-pagination
        background
        layout="prev, pager, next, total"
        :total="currentRules.length"
        :page-size="pageSize"
        :current-page.sync="currentPage"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script src="./metric-table.js"></script>
<style lang="scss">
@import './metric-table';
</style>
