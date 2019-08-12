import { mapGetters, mapState } from 'vuex';
import { APPLICATION_CONFIG } from '@/core/constants/app';
import { INSTANCE_STATUS, STATUS_COLOR } from '@/core/constants/constants';
import ApplicationService from '@/core/services/application.service';
import InstanceService from '@/core/services/instance.service';
import getAppStatus from '@/core/utils/instance-status';
import isApprove from '@/core/utils/is-approve';
import ErrorInfoMixin from '@/view/mixins/error-info';
// mixins
import tableView from '@/view/mixins/table-view';
// dialogs
import ErrorInfoDialog from '@/view/pages/dialogs/instance/error-info';

export default {
  name: 'ApplicationList',

  extends: tableView('id', 10, 'created_at', 'desc'),

  mixins: [ErrorInfoMixin],

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
    ...mapGetters(['isZoneSyncing', 'getService']),

    service() {
      return {
        ...APPLICATION_CONFIG,
        links: [{ text: APPLICATION_CONFIG.name }],
      };
    },

    brokerService() {
      return this.service.brokerService || {};
    },
  },

  created() {
    this.initTable();
    this.loadInstances();
  },

  methods: {
    loadInstances() {
      this.loadings.instances = true;
      ApplicationService.listInstance(this.space.id, this.zone.id)
        .then(list => {
          this.rows = list;
        })
        .finally(() => {
          this.loadings.instances = false;
        });
    },

    initTable() {
      this.setTableProps([
        {
          id: 'name',
          name: '实例',
          type: 'goto',
          other: { onClick: this.gotoDetail },
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
          name: '部署状态',
          type: 'status',
          value: x => getAppStatus(x, '已经部署'), // 默认值为不填
          other: {
            onClick: this.showErrorInfo,
            status: this.getStatus,
          },
        },
      ]);

      const disableDelete = item => {
        return !this.$can('delete') || isApprove(item.status);
      };
      this.setTableOperations([
        {
          name: '删除',
          event: 'remove-confirm',
          disabled: disableDelete,
          tooltip: '您暂无权限删除应用实例',
        },
      ]);
    },

    deployApplication() {
      const { serviceId, brokerServiceId } = this;

      this.$router.push({
        name: 'deploy.app',
        query: {
          serviceId,
          brokerServiceId,
        },
      });
    },

    gotoDetail(instance) {
      if (instance.status === INSTANCE_STATUS.CREATE_PROCESS_REJECTED) {
        this.$noty.error('您的实例创建请求没有审批通过，请联系管理员');
        return;
      }

      const instanceId = instance.id;

      this.$router.push({
        name: 'console.application',
        params: {
          instanceId,
        },
      });
    },

    ensureRemove(instance) {
      this.$tada
        .confirm({
          title: `删除${instance.name}`,
          text: `您确定要删除${this.service.name}实例 ${instance.name} 吗？`,
        })
        .then(ok => {
          if (ok) {
            this.removeInstanceFromTenant(instance).then(() => {
              this.loadInstances();
            });
          }
        });
    },

    removeInstanceFromTenant(instance) {
      return InstanceService.deleteInstance(instance.id).then(deletedInstance => {
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
