import VolumeService from '@/core/services/volume.service';
import { mapState } from 'vuex';
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
  name: 'DeployVolume',

  components: {
    ConfigPanel,
    OverviewPanel,
    FinishPanel,
    CheckoutFooterPanel,
  },

  data() {
    return {
      formModel: {},
      STEPS,
      stepIndex: STEPS.CONFIG,
      error: {},
      valid: true,
      purchasing: false,
      purchased: false,
    };
  },

  computed: {
    ...mapState(['space', 'zone']),
  },

  methods: {
    purchase() {
      this.volumeError = {};
      this.purchasing = true;

      VolumeService.createVolume(this.space.id, this.formModel, this.zone.id)
        .then(() => {
          this.error = {};
        })
        .catch(err => {
          this.error = err;
        })
        .finally(() => {
          this.purchased = true;
          this.purchasing = false;
          this.next(STEPS.OVERVIEW);
        });
    },

    next(step) {
      switch (step) {
        case STEPS.CONFIG: {
          this.$refs.configPanel.$validator.validateAll().then(valid => {
            if (valid) {
              this.formModel = this.$refs.configPanel.form;
              this.stepIndex = STEPS.OVERVIEW;
            }
          });
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
        case STEPS.FINISH: {
          this.purchased = false;
          this.stepIndex = STEPS.CONFIG;
          break;
        }
        default:
      }
    },
  },
};
