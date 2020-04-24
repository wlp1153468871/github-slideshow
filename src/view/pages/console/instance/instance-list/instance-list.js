import Vue from 'vue';
import { mapGetters, mapState } from 'vuex';
import { first } from 'lodash';
import SpaceService from '@/core/services/space.service';
import InstanceService from '@/core/services/instance.service';

import ErrorInfo from '@/view/mixins/error-info';
import isApprove from '@/core/utils/is-approve';
import { INSTANCE_STATUS, STATUS_COLOR, SERVICE_STATUS } from '@/core/constants/constants';

import planDescMixin from '@/view/mixins/plan-desc';

import ErrorInfoDialog from '@/view/pages/dialogs/instance/error-info';

export default {
  name: 'InstanceList',

  mixins: [ErrorInfo, planDescMixin],

  components: {
    ErrorInfoDialog,
  },

  data() {
    const {
      params: { serviceId },
      query: { brokerServiceId },
    } = this.$route;
    return {
      brokerServiceId,
      serviceId,
      INSTANCE_STATUS,
      rows: [],
      quotas: [],
      loadings: {
        instances: false,
      },
      filterMethod: (data, filterKey) => data.name.toLowerCase().includes(filterKey),
      other: {
        status: (_, item) => {
          const { status } = item;
          if (/ing$/.test(status) && status !== INSTANCE_STATUS.RUNNING) {
            return STATUS_COLOR.CONTINUE;
          } else if (
            /failed$/.test(status) ||
            status === INSTANCE_STATUS.PROCESS_REJECTED ||
            status === INSTANCE_STATUS.CREATE_PROCESS_REJECTED
          ) {
            return STATUS_COLOR.DANGER;
          } else if (status === INSTANCE_STATUS.STOP) {
            return STATUS_COLOR.STOPED;
          }
          return STATUS_COLOR.SUCCESS;
        },
      },
    };
  },

  computed: {
    ...mapState(['space', 'zone', 'user']),
    ...mapGetters([
      'isZoneSyncing',
      'getService',
      'isPlatformAdmin',
      'isOrganizationAdmin',
      'isSpaceAdmin',
    ]),

    service() {
      try {
        return this.getService(this.serviceId);
      } catch (e) {
        console.error(e);
        this.$router.push({
          name: 'console.gateway',
        });
      }
      return {};
    },

    brokerService() {
      return first(this.service.services) || {};
    },

    isDeleted() {
      return this.service.available === SERVICE_STATUS.BROKERDELETED;
    },

    resource() {
      return {
        key: this.instanceId,
        name: this.service.name,
        logo: this.service.logo_url,
        helpUrl: this.service.help_url,
        links: [{ text: this.service.name }],
      };
    },
  },

  created() {
    this.init();
  },

  methods: {
    init() {
      this.loadInstances();
    },

    loadInstances() {
      this.loadings.instances = true;
      SpaceService.getInstances(this.brokerServiceId)
        .then(instances => {
          this.rows = instances;
        })
        .finally(() => {
          this.loadings.instances = false;
        });
    },

    deployService() {
      const { serviceId, brokerServiceId } = this;
      this.$router.push({
        name: 'product.checkout',
        params: {
          serviceId,
        },
        query: {
          brokerServiceId,
        },
      });
    },

    gotoDetail(instance) {
      if (instance.status === INSTANCE_STATUS.CREATE_PROCESS_REJECTED) {
        this.$noty.error('您的实例创建请求没有审批通过，请联系管理员');
        return;
      }

      if (instance.status === INSTANCE_STATUS.APPROVING) {
        this.$noty.error('您的实例创建请求正在审批，暂时无法查看详情');
        return;
      }

      const instanceId = instance.id;
      const { serviceId, brokerServiceId } = this;
      this.$router.push({
        name: 'console.instance',
        params: {
          serviceId,
          instanceId,
        },
        query: {
          brokerServiceId,
        },
      });
    },

    ensureRemove(instance) {
      this.$tada
        .confirm({
          title: `删除${instance.name}`,
          text: `您确定要删除${this.service.name}实例 ${instance.name} 吗？`,
        })
        .then(willDelete => {
          if (willDelete) {
            this.removeInstanceFromTenant(instance);
          }
        });
    },

    removeInstanceFromTenant(instance) {
      InstanceService.deleteInstance(instance.id).then(deletedInstance => {
        this.applyChange(deletedInstance);
        this.$noty.success(`删除实例 ${instance.name} 成功。`);
        this.loadInstances();
      });
    },

    applyChange(newInstance) {
      this.rows = this.rows.map(instance => {
        return instance.id === newInstance.id ? newInstance : instance;
      });
    },

    // handleOperate(command, instance) {
    //   if (command === 'delete') {
    //     this.ensureRemove(instance);
    //   }
    // },

    renderStatus(status) {
      const filters = Vue.filter('filters');
      return filters(status, 'instance_status');
    },

    disableDelete(item) {
      return (
        isApprove(item.status) || !this.brokerService.instances_deletable || this.isZoneSyncing
      );
    },
  },

  watch: {
    $route(to) {
      this.rows = [];
      this.serviceId = to.params.serviceId;
      this.brokerServiceId = to.query.brokerServiceId;
      this.loadInstances();
    },
  },
};
