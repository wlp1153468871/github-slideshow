import { cloneDeep } from 'lodash';
import { mapState, mapGetters } from 'vuex';

import AlarmService from '@/core/services/alarm.service.ts';

export default {
  data() {
    return {
      pageSize: 20,
      currentPage: 1,
      searchKey: '',
      currentRules: [],
    };
  },
  created() {
    this.currentRules = cloneDeep(this.rules);
  },
  computed: {
    ...mapState({
      loading: state => state.loadings.alarmListView,
    }),
    ...mapGetters({
      adminAccessed: 'alarmAdminAccessed',
    }),
    currentRulesBasedPage() {
      const from = (this.currentPage - 1) * this.pageSize;
      return this.currentRules.slice(from, from + this.pageSize);
    },
  },
  props: {
    rules: { type: Array, required: true },
  },
  methods: {
    onSearch() {
      if (this.searchKey === '') {
        this.currentRules = this.rules;
      } else {
        this.currentRules = this.rules
          .filter(rule => {
            const key = this.searchKey.toLowerCase();
            return rule.name.toLowerCase().includes(key)
              || rule.metricName.toLowerCase().includes(key);
          });
      }
    },
    async onClickRemove({ id, name }) {
      if (await this.$tada.confirm({
        title: '删除规则',
        text: `您确定要删除 规则 ${name} 吗？`,
      })) {
        await this.removeRule(id);
        this.$noty.success('成功删除规则');
        this.$emit('updateRulesLayer');
      }
    },
    async removeRule(id) {
      return AlarmService.deleteAlarmRules(id);
    },
  },
  watch: {
    rules(val) {
      this.currentRules = cloneDeep(val);
    },
  },
};
