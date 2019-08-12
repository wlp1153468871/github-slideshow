import { find, first, get as getValue } from 'lodash';
import ChargingService from '@/core/services/charging.service';

export default {
  data() {
    return {
      chargingTypes: [],
      chargingRuleDetailIds: [],
      price: 0,
    };
  },

  methods: {
    searchChargingRules(planId) {
      ChargingService.getChargingRules(planId)
        .then(rules => {
          this.chargingRule = first(rules);
          this.chargingTypes = this.chargingRule.charging_rule_details;
          const chargeRuleId = getValue(
            rules,
            '[0].charging_rule_details[0].id',
          );
          if (chargeRuleId) this.chargingRuleDetailIds = [chargeRuleId];
        })
        .catch(e => {
          console.error(e);
          this.$noty.error('该商品暂不存在价格, 请联系管理员!');
        });
    },

    changeChargingType(code) {
      const type = find(this.chargingTypes, { charging_type_code: code });
      this.chargingRuleDetailIds = [type.id];
      ChargingService.getPrice(this.chargingRuleDetailIds).then(res => {
        const { price = 0 } = res;
        this.price = price;
      });
    },
  },
};
