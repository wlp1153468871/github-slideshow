import { mapState } from 'vuex';
import { get as getValue, orderBy } from 'lodash';
import { RESOURCE } from '@/core/constants/resource';
import { CONFIG_TITLE_TYPE } from '@/core/constants/constants';
import SecretService from '@/core/services/secret.service';
import InstanceService from '@/core/services/instance.service';
// panels
import LabelsTable from '../../_panels/labels-table';
import SeniorPanel from '../../_panels/senior';
import EventPanel from '../../_panels/event';

export default {
  name: 'SecretMapDetail',

  components: {
    LabelsTable,
    SeniorPanel,
    EventPanel,
  },

  data() {
    const { name: secretName } = this.$route.params;

    const TABS = {
      OVERVIEW: '概览',
      EVENT: '操作记录',
      SENIOR: '高级设置',
    };

    return {
      secretName,
      CONFIG_TITLE_TYPE,
      TABS,
      secret: {},
      data: {},
      labels: {},
      annotations: {},
      status: '',
      secretType: '',
      events: [],
      loadings: {
        secret: false,
      },
    };
  },

  computed: {
    ...mapState(['zone', 'space']),

    resource() {
      return {
        ...RESOURCE.SECRET,
        links: [
          { text: 'Secret', route: { name: 'resource.secrets.list' } },
          { text: this.secretName },
        ],
      };
    },
  },

  created() {
    this.loadSecretDetail();
  },

  methods: {
    loadSecretDetail() {
      this.loadings.secret = true;
      return SecretService.getSecret(this.space.id, this.zone.id, this.secretName)
        .then(instance => {
          const {
            originData: secret,
            id: instanceId,
            status,
          } = instance;
          this.secret = SecretService.decodeSecret(secret);
          this.status = status;
          this.initLabelsTable(this.secret);

          if (instanceId) {
            this.loadEvents(instanceId);
          }
        })
        .finally(() => {
          this.loadings.secret = false;
        });
    },

    loadEvents(instanceId) {
      InstanceService.getLogs(instanceId).then(events => {
        this.events = orderBy(events, 'started_at', 'desc');
      });
    },

    initLabelsTable(secret) {
      this.data = getValue(secret, 'data', {});
      this.labels = getValue(secret, 'metadata.labels', {});
      this.annotations = getValue(secret, 'metadata.annotations', {});
      this.secretType = getValue(secret, 'type', '');
    },

    editData(data) {
      this.update(data, this.labels, this.annotations);
    },

    editLabel(labels) {
      this.update(this.data, labels, this.annotations);
    },

    editAnnotations(annotations) {
      this.update(this.data, this.labels, annotations);
    },

    parseAsSecret(data, labels, annotations) {
      const namespace = this.space.short_name;

      return SecretService.encodeSecret({
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

    update(data, labels, annotations) {
      const secret = this.parseAsSecret(data, labels, annotations);
      SecretService.updateSecret(
        this.space.id,
        this.zone.id,
        this.secretName,
        secret,
      )
        .then(() => {
          return this.loadSecretDetail();
        }).then(() => {
          if (this.status === 'approving') {
            this.$noty.success('创建审批成功');
          } else {
            this.$noty.success('更新成功');
          }
        });
    },

    deleteSecret() {
      SecretService.deleteSecret(this.space.id, this.zone.id, this.secretName).then(() => {
        this.$router.push(RESOURCE.SECRET.route);
        this.$noty.success('成功删除 Secret');
      });
    },
  },
};
