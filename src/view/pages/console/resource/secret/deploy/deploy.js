import { mapState } from 'vuex';
import { CONFIG_TITLE_TYPE } from '@/core/constants/constants';
import SecreatService from '@/core/services/secret.service';
// panels
import SpaceZone from '@/view/components/space-zone/space-zone';
import LabelsTable from '../../_panels/labels-table';
import CheckoutFooterPanel from '../../_panels/checkout-footer';
import OverviewPanel from '../../_panels/overview';
import FinishPanel from '../../_panels/finish';

const STEPS = {
  CONFIG: '1-1',
  OVERVIEW: '2-1',
  FINISH: '2-2',
};

const SECRET_TYPES = [
  { value: 'Opaque' },
];

export default {
  name: 'deploySecret',

  components: {
    SpaceZone,
    LabelsTable,
    CheckoutFooterPanel,
    OverviewPanel,
    FinishPanel,
  },

  data() {
    return {
      type: 'secret',
      CONFIG_TITLE_TYPE,
      STEPS,
      stepIndex: STEPS.CONFIG,
      loadings: {
        purchasing: false,
      },
      instanceError: {},
      secretName: '',
      secretType: 'Opaque',
      secretTypes: SECRET_TYPES,
      labels: {},
      annotations: {},
      data: {},
      instance: {},
    };
  },
  computed: {
    ...mapState({
      localOrg: 'org',
      localSpace: 'space',
      localZone: 'zone',
    }),

    valid() {
      return !this.veeErrors.any() && this.secretName !== '';
    },

  },
  methods: {
    editData(data) {
      this.data = data;
    },

    editLabel(labels) {
      this.labels = labels;
    },

    editAnnotations(annotations) {
      this.annotations = annotations;
    },

    purchase() {
      this.instanceError = {};
      const secret = this.parseAsSecret();
      const spaceId = this.localSpace.id;
      const zoneId = this.localZone.id;

      this.loadings.purchasing = true;
      SecreatService.createSecret(spaceId, zoneId, secret)
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

    parseAsSecret() {
      const { data, labels, annotations } = this;
      const namespace = this.localSpace.short_name;

      return SecreatService.encodeSecret({
        apiVersion: 'v1',
        kind: 'Secret',
        data,
        type: this.secretType,
        metadata: {
          name: this.secretName,
          namespace,
          annotations,
          labels,
        },
      });
    },

    next(step) {
      switch (step) {
        case STEPS.CONFIG: {
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
