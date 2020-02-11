import { ALARM_CONFIG } from '@/core/constants/alarm';
import AlarmService from '@/core/services/alarm.service.ts';
import { mapMutations, mapState } from 'vuex';
import { ALARM_LIST_VIEW_REQUEST, ALARM_LIST_VIEW_SUCCESS, ALARM_RULES } from '@/core/store/mutation-types';

import Container from './container/container.vue';
import App from './app/app.vue';
import Service from './service/service.vue';

export default {
  data() {
    return {
      rules: [],
      accessed: true,
    };
  },
  computed: {
    ...mapState(['zone', 'loadings']),
    containerRules() {
      return this.rules.filter(rule => rule.ruleType === 'container');
    },
    appRules() {
      return this.rules.filter(rule => rule.ruleType === 'app');
    },
    serviceRules() {
      return this.rules.filter(rule => rule.ruleType === 'service');
    },
    resource() {
      return {
        ...ALARM_CONFIG,
        description: `可用区：${this.zone.area_name}-${this.zone.env_name}`,
      };
    },
  },
  async created() {
    await this.updateRules();
  },
  components: {
    Container,
    App,
    Service,
  },
  methods: {
    ...mapMutations([
      ALARM_LIST_VIEW_REQUEST,
      ALARM_LIST_VIEW_SUCCESS,
      ALARM_RULES,
    ]),

    async getAllRules() {
      try {
        this[ALARM_LIST_VIEW_REQUEST]();
        const { rules } = await AlarmService.getAllAlarmRules();
        this[ALARM_RULES](rules);
        return rules;
      } catch ({ status }) {
        if (status === 423) {
          this.accessed = false;
        }
        return [];
      } finally {
        this[ALARM_LIST_VIEW_SUCCESS]();
      }
    },
    async updateRules() {
      this.rules = await this.getAllRules();
    },
  },
};
