import { mapGetters } from 'vuex';
import { cloneDeep } from 'lodash';
import { MONITOR_KIND, MONITOR_KIND_MAP_FLIP } from '@/core/constants/constants';

export default {
  data() {
    return {
      filterType: '',
      typeList: Object.values(MONITOR_KIND),
      currentRules: [],
    };
  },
  props: {
    rules: { type: Array, required: true },
  },
  created() {
    this.currentRules = cloneDeep(this.rules);
  },
  computed: {
    ...mapGetters({
      adminAccessed: 'alarmAdminAccessed',
    }),
  },
  methods: {
    onChooseType() {
      this.currentRules = this.rules.filter(rule => {
        return rule.scope.some(s => s.type === MONITOR_KIND_MAP_FLIP[this.filterType]);
      });
    },
    onAddRulesCommon(query) {
      this.$router.push({
        name: 'console.alarm.create',
        query,
      });
    },
    updateRulesLayer() {
      this.$emit('updateRules');
    },
    checkFilterType() {
      if (!this.filterType) {
        this.$noty.error('请选择类型');
        return false;
      }
      return true;
    },
    checkFilterService() {
      if (!this.filterService) {
        this.$noty.error('请选择类型');
        return false;
      }
      return true;
    },
  },
  watch: {
    rules() {
      this.currentRules = cloneDeep(this.rules);
    },
  },
};
