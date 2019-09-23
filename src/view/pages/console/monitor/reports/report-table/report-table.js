export default {
  data() {
    return {
      searchKey: '',
      currentPage: 1,
      pageSize: 10,
    };
  },
  computed: {
    currentKindMap() {
      const from = (this.currentPage - 1) * this.pageSize;
      return this.kindMap.slice(from, from + this.pageSize);
    },
  },
  props: {
    kindMap: { type: Array, required: true },
    placeholder: { type: String, default: '请输入搜索内容' },
    loading: { type: Boolean, default: false },
  },
  methods: {
    onSearch() {
      this.$emit('search', this.searchKey);
    },
  },
};
