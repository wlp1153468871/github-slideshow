import { cloneDeep } from 'lodash';

export default {
  data() {
    return {
      pageSize: 20,
      currentPage: 1,
      searchKey: '',
      currentRules: [],
    };
  },
  props: {
    loading: { type: Boolean, default: false },
    rules: { type: Array, required: true },
  },
  created() {
    this.currentRules = cloneDeep(this.rules);
  },
  computed: {
    currentRulesBasedPage() {
      const from = (this.currentPage - 1) * this.pageSize;
      return this.currentRules.slice(from, from + this.pageSize);
    },
  },
  methods: {
    onSearch() {
      if (this.searchKey === '') {
        this.currentRules = this.rules;
      } else {
        this.currentRules = this.rules.filter(rule => {
          const key = this.searchKey.toLowerCase();
          return rule.name.toLowerCase().includes(key) || rule.expr.toLowerCase().includes(key);
        });
      }
    },
  },
  watch: {
    rules(val) {
      this.currentRules = cloneDeep(val);
    },
  },
};
