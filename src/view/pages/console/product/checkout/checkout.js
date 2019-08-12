import InstanceService from '@/core/services/instance.service';
import ChargeModuleMixin from '@/view/mixins/charge-module';

import { mapState, mapGetters } from 'vuex';
import FinishPanel from './panels/finish';
import CheckoutFooterPanel from './panels/checkout-footer';
import ConfigPanel from './panels/config';
import OverviewPanel from './panels/overview';

const STEPS = {
  CONFIG: '1-1',
  OVERVIEW: '2-1',
  FINISH: '2-2',
};

export default {
  name: 'ProductCheckout',

  mixins: [ChargeModuleMixin],

  components: {
    ConfigPanel,
    OverviewPanel,
    FinishPanel,
    CheckoutFooterPanel,
  },

  data() {
    const {
      params: { serviceId },
      query: { brokerServiceId },
    } = this.$route;
    return {
      brokerServiceId,
      serviceId,
      formModel: {},
      STEPS,
      stepIndex: STEPS.CONFIG,
      instance: null,
      instanceError: {},
      loadings: {
        purchasing: false,
      },
      valid: true,
    };
  },

  computed: {
    ...mapState(['space', 'zone']),
    ...mapGetters(['getService']),

    service() {
      try {
        return this.getService(this.serviceId);
      } catch (e) {
        console.error(e);
      }
      return {};
    },
  },

  methods: {
    purchase() {
      this.loadings.purchasing = true;
      this.instanceError = {};

      const params = this.formModel.parameters
        .filter(({ value }) => Boolean(value))
        .map(({ id, value }) => ({
          id,
          value,
        }));

      InstanceService.createInstance(this.space.id, this.brokerServiceId, {
        params,
        plan_id: this.formModel.planId,
        zone_id: this.zone.id,
        charging_rule_detail_ids: this.chargingRuleDetailIds,
      })
        .then(instance => {
          this.instance = instance;
        })
        .catch(err => {
          this.instanceError = err;
        })
        .finally(() => {
          this.next(STEPS.OVERVIEW);
          this.loadings.purchasing = false;
        });
    },

    next(step) {
      switch (step) {
        case STEPS.CONFIG: {
          const model = this.$refs.configPanel.formModel();
          this.formModel = {
            ...this.formModel,
            ...model,
          };
          this.stepIndex = STEPS.OVERVIEW;
          break;
        }
        case STEPS.OVERVIEW: {
          this.stepIndex = STEPS.FINISH;
          break;
        }
        default:
      }
    },

    prev(step) {
      switch (step) {
        case STEPS.OVERVIEW:
          this.stepIndex = STEPS.CONFIG;
          break;
        case STEPS.FINISH:
          this.stepIndex = STEPS.CONFIG;
          break;
        default:
      }
    },
  },
};
