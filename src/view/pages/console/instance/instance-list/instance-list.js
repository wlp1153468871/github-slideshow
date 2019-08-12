import { mapGetters, mapState } from 'vuex';
import { first } from 'lodash';
import SpaceService from '@/core/services/space.service';
import InstanceService from '@/core/services/instance.service';

import tableView from '@/view/mixins/table-view';
import ErrorInfo from '@/view/mixins/error-info';
import isApprove from '@/core/utils/is-approve';
import {
  INSTANCE_STATUS,
  STATUS_COLOR,
  SERVICE_STATUS,
} from '@/core/constants/constants';

import planDescMixin from '@/view/mixins/plan-desc';

import ErrorInfoDialog from '@/view/pages/dialogs/instance/error-info';

export default {
  name: 'InstanceList',

  extends: tableView('id', 10, 'created_at', 'desc'),

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
    };
  },

  computed: {
    ...mapState(['space', 'zone', 'user']),
    ...mapGetters([
      'isZoneSyncing',
      'getService',
      'zoneUnauthorized',
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
          name: 'console.dashboard',
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
      this.initTable();
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

    initTable() {
      const statusOther = {
        onClick: this.showErrorInfo,
        status: this.getStatus,
      };
      const plan = (item, instance) => {
        return this.getPlanDetails(item, instance.service.name);
      };

      this.setTableProps([
        {
          id: 'name',
          name: '实例',
          type: 'goto',
          other: { onClick: this.gotoDetail },
        },
        {
          id: 'plan',
          name: '规格',
          value: plan,
          sort: 'plan.name',
        },
        { id: 'created_at', name: '创建时间', filter: 'unix_date' },
        {
          id: 'owner',
          name: '创建者',
          value: 'owner.name',
          sort: 'owner.name',
        },
        {
          id: 'status',
          name: '状态',
          type: 'status',
          filter: 'instance_status',
          other: statusOther,
        },
      ]);
      const toolTips = this.brokerService.instances_deletable
        ? '暂无权限删除实例'
        : '无法删除实例';
      const disableDelete = item => {
        return (
          !this.$can('delete') ||
          isApprove(item.status) ||
          !this.brokerService.instances_deletable ||
          this.isZoneSyncing
        );
      };
      this.setTableOperations([
        {
          name: '删除',
          event: 'remove-confirm',
          disabled: disableDelete,
          tooltip: toolTips,
        },
      ]);
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
            this.loadInstances();
          }
        });
    },

    removeInstanceFromTenant(instance) {
      InstanceService.deleteInstance(instance.id).then(deletedInstance => {
        this.applyChange(deletedInstance);
        this.$noty.success(`删除实例 ${instance.name} 成功。`);
      });
    },

    applyChange(newInstance) {
      this.rows = this.rows.map(instance => {
        return instance.id === newInstance.id ? newInstance : instance;
      });
    },

    getStatus(_, item) {
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

  watch: {
    $route(to) {
      this.rows = [];
      this.serviceId = to.params.serviceId;
      this.brokerServiceId = to.query.brokerServiceId;
      this.loadInstances();
    },
  },
};
