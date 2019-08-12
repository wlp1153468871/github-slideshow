import { mapState } from 'vuex';
import { first, find } from 'lodash';

export default {
  props: {
    chargingTypes: { type: Array, default: () => [] },
    price: { type: Number, default: 0 },
  },

  data() {
    return {
      type: '',
    };
  },

  watch: {
    chargingTypes: {
      immediate: true,
      handler(chargingTypes = []) {
        const type = first(chargingTypes);
        if (type) {
          // 判断上一次选择的计费模式是否存在当前选项中
          const isExitType = find(chargingTypes, {
            charging_type_code: this.type,
          });
          if (!this.type || !isExitType) {
            this.type = type.charging_type.code;
          }
          this.changeChargingType(this.type);
        }
      },
    },
  },

  computed: {
    ...mapState(['chargingEnable']),
  },

  methods: {
    changeChargingType(code) {
      this.$emit('changeChargingType', code);
    },
  },
};
