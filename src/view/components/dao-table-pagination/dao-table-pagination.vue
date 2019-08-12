<template>
  <div
    class="table-pagination"
    v-if="display">
    <div class="dao-btn-group">
      <button
        class="pagi-btn dao-btn btn-sm has-icon white"
        @click="$emit('prev')"
        :disabled="disablePrev">
        <svg class="icon">
          <use xlink:href="#icon_caret-left"></use>
        </svg>
      </button>
      <button
        class="pagi-btn dao-btn btn-sm has-icon white"
        @click="$emit('next')"
        :disabled="disableNext">
        <svg class="icon">
          <use xlink:href="#icon_caret-right"></use>
        </svg>
      </button>
    </div>
    <span class="table-pagination-span">
      <b>{{ currentPage }}</b> / {{ totalPage }}，共 {{ totalCount }} 个{{ itemText }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'DaoTablePagination',
  props: {
    pagination: { type: Object, required: true },
    itemText: { type: String, default: '' },
  },
  computed: {
    display() {
      const { tChunks, tLimit } = this.pagination;
      return tChunks.length !== 0 && tLimit !== Infinity;
    },

    totalCount() {
      return this.pagination.tTotalCount;
    },

    disablePrev() {
      return this.pagination.tPage === 0;
    },

    disableNext() {
      const { tChunks, tPage } = this.pagination;
      return tChunks.length === 0 || tPage === tChunks.length - 1;
    },

    // firstPage() {
    //   const { tChunks, tPage, tLimit } = this.pagination;
    //   return tChunks.length > 0
    //     ? (tPage * tLimit) + 1
    //     : 0;
    // },

    currentPage() {
      const { tPage = 0 } = this.pagination;
      return tPage + 1;
    },

    totalPage() {
      const { tChunks = 0 } = this.pagination;
      return tChunks.length;
    },

    // lastPage() {
    //   const {
    //     tChunks, tCurrentList, tPage, tLimit,
    //   } = this.pagination;
    //   return (tChunks.length === 0 || tPage === tChunks.length - 1)
    //     ? (tPage * tLimit) + tCurrentList.length
    //     : (tPage + 1) * tLimit;
    // },
  },
};
</script>

<style lang="scss">
@import "~daoColor";

.table-pagination {
  margin-top: 10px;
  .table-pagination-span {
    display: inline-block;
    margin-left: 10px;
    color: $grey-dark;
  }
  .pagi-btn {
    padding: 0 4px;
    .icon {
      vertical-align: sub;
    }
  }
}
</style>
