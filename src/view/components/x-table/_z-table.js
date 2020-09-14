

const delay = 800;
export default {
  name: 'z-table',

  props: {
    data: { type: Array, default: () => [] },
    filterMethod: { type: Function }, // 过滤函数
    loading: { type: Boolean, default: false },
    small: { type: Boolean, default: false },
    initalPageSize: { type: Number, default: 10 },
    showRefresh: { type: Boolean, default: true },
    searchPlaceholder: { type: String, default: '请输入搜索内容' },
    emptyText: { type: String },
    paginate: { type: Boolean, default: true },
    total: { type: Number }, // 总条数
  },

  data() {
    return {
      filterKey: '',
      currentPage: 1,
      pageSize: this.small ? 5 : this.initalPageSize,
      timer: null,
      type: true, // true 正常切换,false tab条数切换
    };
  },
  methods: {
    search() {
      if (this.timer) return;
      this.timer = setTimeout(() => {
        if (this.currentPage !== 1) {
          this.type = false;
          this.currentPage = 1;
        }
        this.filterMethod(this.filterKey.trim(), this.pageSize);
        this.timer = null;
      }, delay);
    },
  },
  watch: {
    currentPage: {
      handler() {
        if (!this.type) {
          this.type = true;
          return;
        }
        this.$emit('switch', this.currentPage, this.pageSize, this.filterKey);
      },
    },
    pageSize: {
      handler() {
        if (this.currentPage !== 1) {
          this.type = false;
          this.currentPage = 1;
        }
        this.$emit('switch', this.currentPage, this.pageSize, this.filterKey.trim());
      },
    },
  },
};
