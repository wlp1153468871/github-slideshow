import { mapGetters, mapState } from 'vuex';
import { cloneDeep, intersection } from 'lodash';
import { MONITOR_KIND_MAP_FLIP, MONITOR_KIND_MAP } from '@/core/constants/constants';

export default {
  data() {
    return {
      filterType: '',
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
    ...mapState(['apiResource']),
    typeList() {
      return intersection(
        Object.keys(this.apiResource || {}),
        Object.values(MONITOR_KIND_MAP_FLIP),
      )
        .map(kind => MONITOR_KIND_MAP[kind]);
    },
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
