import { RESOURCE_TYPE } from '@/core/constants/resource';
import { get as getValue } from 'lodash';
import Vue from 'vue';
import SecretService from '@/core/services/secret.service';
import isApprove from '@/core/utils/is-approve';
import joinApproveStatus from '@/core/utils/joinApproveStatus.js';

import ErrorInfo from '@/view/mixins/error-info';
import ErrorInfoDialog from '@/view/pages/dialogs/instance/error-info';
import ResourceMixin from '@/view/mixins/resource';

export default {
  name: 'SecretList',

  mixins: [ErrorInfo, ResourceMixin],

  components: {
    ErrorInfoDialog,
  },

  data() {
    return {
      kind: RESOURCE_TYPE.SECRET,
      rows: [],
      selectedYaml: {},
      secret: {},
      loadings: {
        secret: true,
        table: true,
      },
      dialogConfigs: {
        errorInfo: { visible: false },
      },
      filterMethod: (data, filterKey) =>
        data.metadata.name.toLowerCase().includes(filterKey),
    };
  },

  created() {
    this.loadInstances();
  },

  methods: {
    loadInstances() {
      this.loadings.table = true;
      SecretService.listSecret(this.space.id, this.zone.id)
        .then(res => {
          this.rows = joinApproveStatus(res);
        })
        .finally(() => {
          this.loadings.table = false;
          this.loadings.secret = false;
        });
    },

    createSecret() {
      this.$router.push({
        name: 'deploy.secrets',
        query: {
          serviceId: this.brokerServiceId,
        },
      });
    },

    gotoDetail(secret) {
      this.$router.push({
        name: 'resource.secrets.detail',
        params: {
          name: secret.metadata.name,
        },
      });
    },

    confirmDelete(secret) {
      const name = getValue(secret, 'metadata.name');

      this.$tada
        .confirm({
          title: '删除 Secret',
          text: `若应用使用了该 Secret，将会受到影响。您确定要删除 Secret ${name} 吗？`,
        })
        .then(willDelete => {
          if (willDelete) {
            this.deleteSecret(name);
          }
        });
    },

    deleteSecret(name) {
      SecretService.deleteSecret(this.space.id, this.zone.id, name).then(() => {
        this.$noty.success(`删除 Config Map ${name}成功`);
        this.loadInstances();
      });
    },

    disableDelete(item) {
      return isApprove(item.approveStatus);
    },

    humanizeLabel(secret) {
      const {
        metadata: { labels = [] },
      } = secret;
      return (
        Object.entries(labels)
          .map(([key, value]) => `${key} : ${value}`)
          .join(' ')
          .trim() || '-'
      );
    },

    sortName(a, b) {
      return a > b;
    },

    handleOperate(command, secret) {
      if (command === 'edit') {
        this.gotoDetail(secret);
      }
      if (command === 'delete') {
        this.confirmDelete(secret);
      }
    },

    dateFormat(row) {
      const date = getValue(row, 'metadata.creationTimestamp');
      return date ? Vue.filter('date')(date) : '-';
    },
  },
};
