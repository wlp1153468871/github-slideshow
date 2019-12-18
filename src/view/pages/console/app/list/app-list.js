import { mapGetters, mapState } from 'vuex';
import { first, pick } from 'lodash';
import { APPLICATION_CONFIG } from '@/core/constants/resource';
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
        updateByYaml: false,
      },
      dialogConfigs: {
        editYaml: { visible: false },
      },
      recommendNames: [],
      resources: '',
      name: '',
      version: '',
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

    appDeployDisabled() {
      return this.loadings.instances || this.isZoneSyncing || this.loadings.updateByYaml;
    },

    yamlDeployEnabled() {
      return this.name
      && this.version
      && !this.veeErrors.any();
    },
  },

  created() {
    this.initTable();
    this.loadInstances();
  },

  methods: {
    clearYamlEditor() {
      this.name = '';
      this.version = '';
      this.recommendNames = [];
      this.resources = {};
    },
    onCloseYaml() {
      this.clearYamlEditor();
      this.$refs.yamlEditor.onClose();
    },

    onTryConfirmYaml() {
      this.$refs.yamlEditor.tryConfirm();
    },

    onCreateYaml(resources) {
      this.loadings.updateByYaml = true;

      ApplicationService.createInstance(
        this.space.id,
        this.zone.id,
        Object.assign({ resources }, pick(this, ['name', 'version'])),
      )
        .then(res => {
          if (res.is_need_approval) {
            this.$noty.success('请在审批记录页面，查看审批进度');
          } else {
            this.$noty.success('部署成功');
          }
          this.clearYamlEditor();
        })
        .catch(() => {
          // 保留失败时的yaml数据
          this.resources = resources;
        })
        .finally(() => {
          this.loadings.updateByYaml = false;
          this.loadInstances();
        });
    },
    checkIsDuplicateName() {
      if (this.veeErrors.has('name')) return;
      // eslint-disable-next-line no-underscore-dangle
      this.getRecommendedName(this.name).then(res => {
        if (res.is_existed) {
          // eslint-disable-next-line no-underscore-dangle
          this.name = first(res.recommend_names);
          this.recommendNames = res.recommend_names;
        }
      });
    },

    getRecommendedName(name) {
      return ApplicationService.getRecommendedName(
        this.space.id,
        name, // repository name
      );
    },

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
      this.$router.push({
        name: 'deploy.applications',
      });
    },

    gotoDetail(instance) {
      if (instance.status === INSTANCE_STATUS.CREATE_PROCESS_REJECTED) {
        this.$noty.error('您的实例创建请求没有审批通过，请联系管理员');
        return;
      }

      const instanceId = instance.id;

      this.$router.push({
        name: 'console.applications.detail',
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

    toggleYamlDialog() {
      this.dialogConfigs.editYaml.visible = !this.dialogConfigs.editYaml
        .visible;
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
