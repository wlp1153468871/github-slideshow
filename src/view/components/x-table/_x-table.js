import { chunk, nth } from 'lodash';

export default {
  name: 'x-table',

  props: {
    data: { type: Array, default: () => [] },
    filterMethod: { type: Function },
    loading: { type: Boolean, default: false },
    small: { type: Boolean, default: false },
    initalPageSize: { type: Number, default: 20 },
    showRefresh: { type: Boolean, default: true },
    searchPlaceholder: { type: String, default: '请输入搜索内容' },
    emptyText: { type: String },
  },

  data() {
    return {
      filterKey: '',
      currentPage: 1,
      pageSize: this.initalPageSize,
    };
  },

  computed: {
    dataFilteredByKey() {
      const filterKey = this.filterKey.toLowerCase();
      if (!this.filterMethod) return this.data;
      return this.data.filter(row => this.filterMethod(row, filterKey));
    },

    paginaData() {
      return chunk(this.dataFilteredByKey, this.small ? 5 : this.pageSize);
    },

    dataInCurrentPage() {
      return nth(this.paginaData, this.currentPage - 1);
    },

    totalPages() {
      return this.dataFilteredByKey.length;
    },
  },
};
