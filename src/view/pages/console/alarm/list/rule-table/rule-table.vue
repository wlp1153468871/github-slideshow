<template>
  <div id="alarm-rule-table">
    <div class="table-toolbar">
      <div class="table-toolbar-left table-title">
        <slot name="addRule"></slot>
      </div>
      <div class="table-toolbar-right">
        <dao-input
          search
          v-model.trim="searchKey"
          :disabled="loading"
          placeholder="搜索 规则名，指标"
          @change="onSearch"
        >
        </dao-input>
      </div>
    </div>
    <el-table
      :data="currentRulesBasedPage"
      v-loading="loading"
    >
      <el-table-column
        prop="name"
        label="规则名"
        v-slot="{ row }"
      >
        <router-link
          :to="{
            name: 'console.alarm.rule',
            params: { id: row.id }
          }"
        >
          {{ row.name || '_' }}
        </router-link>
      </el-table-column>
      <el-table-column
        prop="metricName"
        label="指标"
      >
      </el-table-column>
      <el-table-column
        prop="threshold"
        label="阈值"
        v-slot="{ row }"
      >
        <span>{{ row.threshold.join('') || '_' }}</span>
      </el-table-column>
      <el-table-column
        prop="for"
        label="持续时间"
        v-slot="{ row }"
      >
        <span>{{ row.for.join('') || '_' }}</span>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="description"
        label="告警内容"
        v-slot="{ row }"
      >
        <span>{{ row.description || '_' }}</span>
      </el-table-column>
      <el-table-column
        label="操作"
        v-slot="{ row }"
      >
        <span class="action">
          <dao-dropdown
            trigger="click"
            placement="bottom-end">
            <slot>
                <svg class="icon icon-more"><use xlink:href="#icon_more"></use></svg>
            </slot>
            <dao-dropdown-menu slot="list">
              <dao-dropdown-item
                v-if="$can('alert.delete', 'alert')"
                @click="onClickRemove(row)">删除</dao-dropdown-item>
            </dao-dropdown-menu>
          </dao-dropdown>
        </span>
      </el-table-column>
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
      <slot name="note"></slot>
    </div>
  </div>
</template>
<script src="./rule-table.js"></script>
<style lang="scss">
  @import './rule-table';
</style>
