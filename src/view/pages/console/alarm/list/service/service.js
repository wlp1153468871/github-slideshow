import AlarmSelector from '@/view/mixins/alarm-selector';
import { mapState } from 'vuex';

import RuleTable from '../rule-table/rule-table.vue';

export default {
  data() {
    return {
      filterService: null,
    };
  },
  computed: {
    ...mapState(['services']),
    serviceList() {
      return this.services
        .filter(service => {
          return typeof service.monitor === 'boolean'
            ? service.monitor
            : JSON.parse(service.monitor.toLowerCase());
        })
        .map(({ services: [{ name, id }] }) => ({ name, id }));
    },
  },
  methods: {
    onAddRules() {
      if (this.checkFilterService()) {
        this.onAddRulesCommon({
          serviceName: this.filterService.name,
          serviceId: this.filterService.id,
          type: 'service',
        });
      }
    },
    onChooseType() {
      this.currentRules = this.rules.filter(rule => {
        return rule.scope.some(s => s.type === this.filterService.name);
      });
    },
  },
  components: {
    RuleTable,
  },
  mixins: [AlarmSelector],
};
