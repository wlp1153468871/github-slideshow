<template>
  <dao-dialog
    class="edit-replica-dialog"
    :config="config"
    :visible.sync="isShow"
    @before-open="onBeforeOpen"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose"
    @dao-dialog-confirm="onConfirm">
    <div class="left">
      <dao-setting-section
        v-for="(bullet, key, index) in standard"
        :key="'section' + index">
        <dao-setting-item>
          <div slot="label">
            规格
          </div>
          <template slot="content">
            <dao-select
              class="reset-margin"
              @change="changePlan(key)"
              v-model="planModel[key]">
              <dao-option
                v-for="option in bullet"
                :key="option.label"
                :value="option.value"
                :label="option.label">
              </dao-option>
            </dao-select>
          </template>
        </dao-setting-item>
      </dao-setting-section>
    </div>
    <div class="left replica-price" v-if="chargingEnable">
      <div class="replica-price-top">
        <p>
          <span class="replica-price-label">原价格: </span>
          <span class="replica-price-content">{{ prePrice | fen_2_yuan }}元</span>
        </p>
        <p>
          <span class="replica-price-label">当前价格: </span>
          <span class="replica-price-content">{{ newPrice | fen_2_yuan }}元</span>
        </p>
        <p>
          <span class="replica-price-label">计费模式: </span>
          <span class="replica-price-content">
            <dao-select
              size="sm"
              style="width: 80px"
              v-model="chargingRule"
              @change="changeChargingType">
              <dao-option
                v-for="(rule, index) in rules"
                :key="index"
                :value="rule.code"
                :label="rule.description">
              </dao-option>
            </dao-select>
          </span>
        </p>
      </div>
      <div class="replica-price-bottom">
        <p>
          <span class="replica-price-label">应补差价: </span>
          <span class="replica-price-content">{{ newPrice - prePrice | fen_2_yuan }}元</span>
        </p>
      </div>
    </div>
    <div slot="footer">
      <button
        class="dao-btn ghost"
        @click="onClose">
        取消
      </button>
      <save-button
        class="blue"
        text="确定"
        :saving="loadings.updating"
        @click="onConfirm">
      </save-button>
    </div>
  </dao-dialog>
</template>

<script>
import { mapState } from 'vuex';
import { convert } from '@/core/utils';
import { first, find, isEmpty, orderBy } from 'lodash';
import { PLANKEY } from '@/core/constants/constants';
import dialog from '@/view/mixins/dialog';
import PlanService from '@/core/services/plan.service';
import ServiceService from '@/core/services/service.service';
import AppService from '@/core/services/app.service';
import ChargingService from '@/core/services/charging.service';

export default {
  name: 'EditPlanDialog',
  extends: dialog('编辑规格', {
    size: 'lg',
  }),
  props: {
    app: { type: Object, default: () => ({}) },
    instance: { type: Object, default: () => ({}) },
    serviceId: { type: String, default: '' },
  },
  data() {
    return {
      PLANKEY,
      configDict: {},
      standard: {},
      planModel: {},
      planId: '',
      prePrice: 0,
      newPrice: 0,
      rules: [], // plan's charging-rule
      chargingRule: '',
      chargingRuleDetailId: [],
      loadings: {
        updating: false,
      },
    };
  },
  computed: {
    ...mapState(['chargingEnable', 'space', 'zone', 'quotaDict']),

    isValidForm() {
      return !this.loadings.updating || !this.veeErrors.any();
    },
  },
  watch: {
    'instance.plan': {
      handler() {
        this.getPlan();
      },
    },

    'app.clustersize': {
      handler(clustersize) {
        if (!this.chargingEnable) return;
        if (clustersize) this.getOriginalPrice();
      },
    },
  },
  methods: {
    getPlan(data) {
      PlanService.getPlan(this.serviceId, data).then(res => {
        Object.entries(res).forEach(([key, value]) => {
          const quota = this.quotaDict[key];
          const { unit } = value;
          if (key === PLANKEY.CONFIG) {
            const options = value.options.map(item => {
              const optionValue = this.groupConfig(item, unit);
              this.configDict[optionValue] = item;
              return {
                label: optionValue,
                value: item,
              };
            });
            this.$set(this.standard, key, options);
            if (!data) {
              this.$set(
                this.planModel,
                key,
                find(value.options, {
                  [PLANKEY.CPU]: this.app.cpu.value,
                  [PLANKEY.MEMORY]: this.app.memory.value,
                }),
              );
            }
          } else if (key === 'storage') {
            this.$set(
              this.standard,
              key,
              value.options.map(v => {
                return {
                  label: `${v}${quota.unit}`,
                  value: v,
                };
              }),
            );
            if (
              !data ||
              (data && value.options.indexOf(this.planModel[key]) === -1)
            ) {
              this.$set(this.planModel, key, value.default);
            }
          }
        });
        this.getParameters();
      });
    },

    groupConfig(item, unit) {
      const { CPU, MEMORY } = PLANKEY;
      const { quotaDict } = this;
      return `${item[CPU] / 1000}${quotaDict[CPU].unit} ${convert(
        item[MEMORY],
        quotaDict[MEMORY].unit,
        unit[MEMORY],
      )}${quotaDict[MEMORY].unit}`;
    },

    changePlan(key) {
      const plan = {
        ...this.planModel,
        currentKey: key,
      };
      this.getPlan(plan);
    },

    async getParameters() {
      if (isEmpty(this.planModel)) {
        return;
      }
      try {
        const response = await ServiceService.getServiceParameters(
          this.serviceId,
          this.space.id,
          this.planModel,
        );
        this.planId = response.planId;
        this.searchChargingRules();
        this.parameters = response.params.map(this.initDefaultValue);
      } catch (err) {
        this.$noty.error('加载服务的参数失败');
      }
    },

    initDefaultValue(param) {
      if (param.type === 'anyOf') {
        const selected = param.default;
        param.options.forEach(x => {
          x.model = selected.includes(x.value);
        }); // evil change!
        param.value = param.default;
        return param;
      }
      if (param.default) {
        param.value = param.default;
        return param;
      }
      if (param.type === 'oneOf') {
        if (param.options) {
          // order options
          param.options = orderBy(param.options, 'name', 'asc');
          // set default value;
          const { value } = param.options[0] || {};
          param.value = value;
        }
      } else if (param.type === 'integer') {
        param.value = 0;
      }
      return param;
    },

    onConfirm() {
      const updated = {
        plan_id: this.planId,
      };
      if (this.chargingEnable) {
        updated.charging_rule_detail_ids = this.chargingRuleDetailId;
      }

      this.loadings.updating = true;
      AppService.updateApp(this.instance.id, updated)
        .then(() => {
          this.$noty.success('修改规格成功');
          this.$emit('update-app');
          this.onClose();
        })
        .finally(() => {
          this.loadings.updating = false;
        });
    },

    searchChargingRules() {
      if (!this.chargingEnable) return;

      ChargingService.getPlanChargingRules(this.planId).then(rules => {
        this.rules = rules;
        const selected = first(rules);
        this.chargingRule = selected.code;
        this.chargingRuleDetailId = [selected.planRuleId];
        this.getPlanPrice(selected.planRuleId).then(priceRule => {
          const { price = 0 } = priceRule;
          this.newPrice = price;
        });
      });
    },

    changeChargingType(ruleCode) {
      const selected = find(this.rules, { code: ruleCode });
      if (selected) {
        this.getPlanPrice(selected.planRuleId).then(priceRule => {
          const { price = 0 } = priceRule;
          this.newPrice = price;
        });
      }
    },

    getOriginalPrice() {
      return ChargingService.getChargingId(this.instance.id).then(res => {
        const chargingRuleDetailId = res.charging_rule_detail_ids;
        let { clustersize } = this.app;
        if (clustersize < 1) clustersize = 1;
        const param = {
          charging_rule_detail_ids: chargingRuleDetailId,
          quantity: clustersize,
        };
        this.chargingRuleDetailId = chargingRuleDetailId;
        return ChargingService.getReplicaPrice(param).then(r => {
          this.prePrice = r.price;
          this.newPrice = r.price;
        });
      });
    },

    getPlanPrice(ruleId) {
      return ChargingService.getReplicaPrice({
        charging_rule_detail_ids: [ruleId],
        quantity: this.app.clustersize,
      });
    },

    onBeforeOpen() {
      if (this.chargingEnable) {
        this.getOriginalPrice();
      }
    },

    dialogWillClose() {
      // this.loadPlans(this.serviceId);
      this.chargingRule = '';
      this.chargingRuleDetailId = [];
      this.loadings.updating = false;
    },
  },
};
</script>
