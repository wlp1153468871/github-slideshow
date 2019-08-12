import { chunk, nth } from 'lodash';

export default {
  name: 'x-table',

  props: {
    data: { type: Array, default: () => [] },
    filterMethod: { type: Function, default: () => {} },
    loading: { type: Boolean, default: false },
  },

  data() {
    return {
      filterKey: '',
      currentPage: 1,
      pageSize: 10,
    };
  },

  computed: {
    dataFilteredByKey() {
      const filterKey = this.filterKey.toLowerCase();
      return this.data.filter(row => this.filterMethod(row, filterKey));
    },

    paginaData() {
      return chunk(this.dataFilteredByKey, this.pageSize);
    },

    dataInCurrentPage() {
      return nth(this.paginaData, this.currentPage - 1);
    },

    totalPages() {
      return this.dataFilteredByKey.length;
    },
  },
};
