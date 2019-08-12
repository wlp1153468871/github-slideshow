import { DEPLOYMENT_TYPE } from '@/core/constants/app';
import { cloneDeep, pick } from 'lodash';
import { mapState } from 'vuex';
import RouteService from '@/core/services/route.service';
import ConfigPanel from './panels/config';
import OverviewPanel from './panels/overview';
import FinishPanel from './panels/finish';
import FooterPanel from './panels/footer';

const STEPS = {
  CONFIG: '1-1',
  OVERVIEW: '2-1',
  FINISH: '2-2',
};

export default {
  name: 'page-deploy-router',

  components: {
    ConfigPanel,
    OverviewPanel,
    FinishPanel,
    FooterPanel,
  },

  computed: {
    ...mapState(['space', 'zone']),
  },

  data() {
    return {
      services: [],
      STEPS,
      step: STEPS.CONFIG,
      instanceError: {},
      instance: {},
      route: {},
      isCreating: false,
    };
  },

  methods: {
    deploy() {
      this.instanceError = {};
      this.isCreating = true;
      const params = cloneDeep(this.route);

      if (params.release_type === DEPLOYMENT_TYPE.DEFAULT) {
        delete params.alternateBackends;
      } else {
        params.alternateBackends = [params.alternateBackends];
      }

      if (!params.secureRoute) {
        delete params.tls;
        delete params.secureRoute;
      }

      if (params.secureRoute && params.tls.termination === 'passthrough') {
        delete params.path;
        params.tls = pick(params.tls, ['termination']);
      }

      RouteService.create(this.space.id, this.zone.id, params)
        .then(instance => {
          this.instance = Object.assign(instance, this.route);
        })
        .catch(err => {
          this.instanceError = err;
        })
        .finally(() => {
          this.next(STEPS.OVERVIEW);
          this.isCreating = false;
        });
    },

    next(step) {
      switch (step) {
        case STEPS.CONFIG: {
          this.route = {
            ...this.$refs.configPanel.formModel,
            ...this.$refs.configPanel.rule,
          };
          this.$refs.configPanel.$validator.validate().then(valid => {
            if (!this.route.backend.name) {
              this.$noty.error('当前 Service 不能为空');
            }
            if (valid && this.route.backend.name) {
              this.step = STEPS.OVERVIEW;
            }
          });
          break;
        }
        case STEPS.OVERVIEW: {
          this.step = STEPS.FINISH;
          break;
        }
        default:
      }
    },

    prev(step) {
      switch (step) {
        case STEPS.OVERVIEW:
          this.step = STEPS.CONFIG;
          break;
        case STEPS.FINISH:
          this.step = STEPS.CONFIG;
          break;
        default:
      }
    },
  },
};
