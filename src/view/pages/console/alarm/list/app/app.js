import AlarmSelector from '@/view/mixins/alarm-selector';

import RuleTable from '../rule-table/rule-table.vue';

export default {
  data() {
    return {};
  },
  methods: {
    onAddRules() {
      if (this.checkFilterType()) {
        this.onAddRulesCommon({ deployType: this.filterType, type: 'app' });
      }
    },
  },
  components: {
    RuleTable,
  },
  mixins: [AlarmSelector],
};
