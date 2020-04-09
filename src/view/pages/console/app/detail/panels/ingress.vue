<template>
  <div class="ingress-panel">
    <x-table :data="ingresses" :showRefresh="false" :filter-method="filterMethod">
      <el-table-column label="名称" sortable :sort-method="sortName" min-width="150">
        <template slot-scope="{ row: ingress }">
          <el-table-name-cell :resource="ingress" routerName="resource.ingresses.detail">
          </el-table-name-cell>
        </template>
      </el-table-column>
      <el-table-column label="域名" min-width="150">
        <template slot-scope="{ row: ingress }">
          {{ formatHost(ingress) }}
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="metadata.creationTimestamp"
        sortable
        width="200"
        :formatter="dateFormat"
      >
      </el-table-column>
    </x-table>
  </div>
</template>

<script>
import Vue from 'vue';
import { get as getValue } from 'lodash';

export default {
  name: 'ingress-panel',

  props: {
    ingresses: { type: Array },
  },

  data() {
    return {
      filterMethod: (data, filterKey) => data.metadata.name.toLowerCase().includes(filterKey),
    };
  },

  methods: {
    sortName(prev, next) {
      return getValue(prev, 'metadata.name') - getValue(next, 'metadata.name');
    },

    formatHost(ingress) {
      const rules = getValue(ingress, 'spec.rules');
      return rules.map(rule => rule.host).join();
    },

    dateFormat(row) {
      const date = getValue(row, 'metadata.creationTimestamp');
      return date ? Vue.filter('date')(date) : '-';
    },
  },
};
</script>
