<template>
  <div class="dao-table-wrapper">
    <table class="dao-table">
      <thead>
        <tr>
          <th v-for="(th, idx) in tableHead" :key="idx">
            {{ th }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowId) in tableBody" :key="rowId">
          <td v-for="(item, itemId) in row" :key="itemId">
            {{ item }}
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="!tableBody.length">
      <empty-state></empty-state>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DaoInfoSheet',
  props: {
    table: { type: Object, default: () => ({}) },
  },
  computed: {
    tableHead() {
      return this.table.head || [];
    },
    tableBody() {
      return this.table.body || [];
    },
  },
};
</script>

<style lang="scss">
.dao-table-wrapper {
  thead,
  tbody {
    tr {
      height: 30px;
      line-height: 30px;
    }
    th,
    td {
      padding: 0 10px;
    }
  }

  tbody {
    tr {
      color: #595f69;
      border: none;
    }
  }
}
</style>
