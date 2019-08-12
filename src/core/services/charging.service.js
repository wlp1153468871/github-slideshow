import { get as getValue, orderBy } from 'lodash';
import api from './api';

class ChargingService {
  constructor() {
    this.api = api;
  }

  getAllChargingOrders(params) {
    return this.api.get('/charging_orders', params);
  }

  getChargingRules(productId) {
    return this.api.get('/charging_rules', { product_id: productId }).then(rules => {
      // TODO(jerry) i will gonna hell
      return rules.map(rule => {
        const { charging_rule_details = [] } = rule;
        if (charging_rule_details.length) {
          rule.charging_rule_details = orderBy(charging_rule_details, 'charging_type_code');
        }
        return rule;
      });
    });
  }

  getPlanChargingRules(planId) {
    return this.getChargingRules(planId).then(res => {
      const planChargingRules = getValue(res, '["0"].charging_rule_details', []);
      return planChargingRules.map(rule => {
        const type = rule.charging_type;
        return {
          ...type,
          planRuleId: rule.id,
        };
      });
    });
  }

  getPrice(chargingRuleDetailIds) {
    return this.api.post('/charging_rules/price', {
      charging_rule_detail_ids: chargingRuleDetailIds,
    });
  }

  // 副本扩展根据 instance_id 查找 charging_rules_id
  getChargingId(instanceId) {
    return this.getInstanceChargingRules(instanceId);
  }

  getInstanceChargingRules(instanceId) {
    return this.api.get(`/instances/${instanceId}/charging_rules`);
  }

  getReplicaPrice(params) {
    return this.api.post('/charging_rules/price', params);
  }
}

export default new ChargingService();
