import ZoneService from '@/core/services/zone.service';
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
  name: 'deploy-zone',

  components: {
    ConfigPanel,
    OverviewPanel,
    FinishPanel,
    FooterPanel,
  },

  data() {
    const { zoneId } = this.$route.query;
    return {
      zoneId,
      STEPS,
      step: STEPS.CONFIG,
      isEditing: false,
      zoneInstance: null,
      zoneModel: {
        clusterUrl: null,
        certificateAuthorityData: null,
        es: {},
        registry: {
          type: 'harbor',
        },
        grafana: {},
        router_config: [],
      },
      instanceError: null,
    };
  },

  computed: {
    isUpdate() {
      return !!this.zoneId;
    },

    operationLabel() {
      return this.isUpdate ? '修改' : '创建';
    },
  },

  created() {
    if (this.isUpdate) {
      ZoneService.get(this.zoneId).then(zone => {
        this.zoneModel = { ...this.zoneModel, ...zone };
      });
    }
  },

  methods: {
    deploy() {
      this.isEditing = true;
      if (this.isUpdate) {
        this.updateZone();
      } else {
        this.createZone();
      }
    },

    createZone() {
      ZoneService.createZone(this.zoneModel)
        .then(zone => {
          this.zoneInstance = zone;
        })
        .catch(err => {
          this.instanceError = err;
        })
        .finally(() => {
          this.next(STEPS.OVERVIEW);
          this.isEditing = false;
        });
    },

    updateZone() {
      ZoneService.updateZone(this.zoneId, this.zoneModel)
        .then(zone => {
          this.zoneInstance = zone;
        })
        .catch(err => {
          this.instanceError = err;
        })
        .finally(() => {
          this.next(STEPS.OVERVIEW);
          this.isEditing = false;
        });
    },

    next(step) {
      switch (step) {
        case STEPS.CONFIG: {
          this.$refs.configPanel.validate().then(valid => {
            if (valid) {
              this.zoneModel = this.$refs.configPanel.form;
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
