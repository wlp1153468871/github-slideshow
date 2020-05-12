import { isEmpty, find } from 'lodash';
import { convert } from '@/core/utils';
import { PLANKEY } from '@/core/constants/constants';
import tableView from '@/view/mixins/table-view';
import QuotaService from '@/core/services/quota.service';
// dialogs
import EditQuotaGroupDialog from '@/view/pages/dialogs/quota/edit-quota-group';

const EDIT_TYPE_CREATE = 'create';
const EDIT_TYPE_UPDATE = 'update';

export default {
  name: 'QuotaGroup',
  extends: tableView('id', 10, 'name'),
  components: {
    EditQuotaGroupDialog,
  },
  created() {
    // loading data
    this.loadQuotaGroups();
    this.loadQuotaFields();

    // setting dao props
    this.setTableProps([
      { id: 'name', name: '配额组名' },
      { id: 'description', name: '描述', filter: 'otherwise' },
    ]);
    // setting dao-list
    this.setTableOperations([
      { name: '修改', event: 'open-update-quota-group-dialog' },
      { name: '删除', event: 'confirm-delete-quota-group' },
    ]);
  },
  data() {
    const { org } = this.$route.params;
    return {
      orgId: org,
      columns: [],
      rows: [],
      quotaGroups: [],
      quotaGroupsMap: new Map(),
      quotaFields: [],
      quotaGroup: {
        limits: [],
      },
      editType: EDIT_TYPE_CREATE,
      dialogConfigs: {
        editQuotaGroup: { visible: false },
      },
      panelConfigs: {
        visible: false,
      },
      loadings: {
        listQuotaGroups: false,
      },
      isCreating: false,
    };
  },
  computed: {
    planDetail() {
      const { quotaGroup, quotaFields } = this;
      const memory = find(quotaFields, { code: PLANKEY.MEMORY });
      const { limits = [] } = quotaGroup;
      const table = {
        head: ['字段名', '值', '单位'],
        body: limits.map(x => {
          const { name = '', unit = '', code = '' } = x;
          let { limit = 0 } = x;
          if (memory && code === memory.code && limit !== '') {
            limit = convert(limit, unit);
          }
          limit = limit === '' ? '不设限制' : limit;
          return [name, limit, unit];
        }),
      };
      return {
        table,
      };
    },
    editTypeDesc() {
      return this.editType === EDIT_TYPE_CREATE ? '创建配额组' : '修改配额组';
    },
  },

  methods: {
    loadQuotaGroups() {
      this.loadings.listQuotaGroups = true;
      QuotaService.listOrgQuotaGroups(this.orgId).then(list => {
        this.quotaGroups = list;
        this.rows = list;
        this.quotaGroupsMap = new Map(list.map(x => [x.name, x]));
        this.loadings.listQuotaGroups = false;
      });
    },

    loadQuotaFields() {
      QuotaService.listQuotaFields().then(list => {
        this.quotaFields = list;
      });
    },

    onCreateQuotaGroup(quotaGroup) {
      this.isCreating = true;
      const { name, description = '', limits = [] } = quotaGroup;
      const quotaGroupLimits = limits
        .filter(x => !isEmpty(x.limit))
        .map(x => ({
          quota_field_id: x.id,
          limit: x.limit,
        }));
      QuotaService.createOrgQuotaGroup(this.orgId, {
        name,
        description,
        quota_group_limits: quotaGroupLimits,
      })
        .then(() => {
          this.closeQuotaDialog();
          this.$noty.success('创建配额组成功');
          this.loadQuotaGroups();
          this.initSelectQuotaGroup();
        })
        .finally(() => {
          this.isCreating = false;
        });
    },

    confirmUpdateQuotaGroup(quotaGroup) {
      this.$tada
        .confirm({
          title: '确认修改',
          text: `
        "配额字段"的修改会影响所有使用该配额组的项目组。
        配额不足将导致无法创建实例，请谨慎修改。
        `,
          primaryText: '确认',
          dangerMode: false,
        })
        .then(yes => {
          if (yes) {
            this.onUpdateQuotaGroup(quotaGroup);
          }
        });
    },

    onUpdateQuotaGroup(quotaGroup) {
      this.isCreating = true;
      const { name, description = '', limits = [] } = quotaGroup;
      const quotaGroupLimits = limits
        .filter(x => x.limit !== '')
        .map(x => ({
          quota_field_id: x.id,
          limit: Number(x.limit),
        }));
      QuotaService.updateOrgQuotaGroup(this.orgId, quotaGroup.id, {
        name,
        description,
        quota_group_limits: quotaGroupLimits,
      })
        .then(res => {
          this.closeQuotaDialog();
          this.$noty.success('修改配额组成功');
          this.loadQuotaGroups();
          this.initSelectQuotaGroup(res);
        })
        .finally(() => {
          this.isCreating = false;
        });
    },

    onCheckedRowsChange([row]) {
      this.initSelectQuotaGroup(row);
    },

    initSelectQuotaGroup(row) {
      if (!row) return;
      const { quota_group_limits, ...other } = row;
      const quotaGroupLimitMap = new Map(quota_group_limits.map(x => [x.quota_field_id, x]));
      const limits = this.quotaFields.map(field => {
        const { limit = '' } = quotaGroupLimitMap.get(field.id) || {};
        return { ...field, limit };
      });

      this.panelConfigs.visible = true;
      this.quotaGroup = {
        ...other,
        limits,
      };
    },

    confirmDeleteQuotaGroup(quotaGroup) {
      const { name } = quotaGroup;
      this.$tada
        .confirm({
          title: '删除配额组',
          text: `您确定要删除配额组 ${name} 吗？`,
        })
        .then(willDelete => {
          if (willDelete) {
            this.deleteQuotaGroup(quotaGroup);
            this.panelConfigs.visible = false;
          }
        });
    },

    deleteQuotaGroup(quotaGroup) {
      return QuotaService.deleteOrgQuotaGroup(this.orgId, quotaGroup.id)
        .then(() => {
          this.loadQuotaGroups();
          this.$noty.success('删除配额组成功');
        })
        .catch(() => {
          this.$noty.error('删除配额组失败');
        })
        .finally(() => {
          this.panelConfigs.visible = false;
        });
    },

    closeQuotaDialog() {
      this.dialogConfigs.editQuotaGroup.visible = false;
    },

    openUpdateQuotaGroupDialog(row) {
      this.initSelectQuotaGroup(row);
      this.editType = EDIT_TYPE_UPDATE;
      this.dialogConfigs.editQuotaGroup.visible = true;
    },

    openCreateQuotaGroupDialog() {
      this.editType = EDIT_TYPE_CREATE;
      this.quotaGroup = {
        name: '',
        description: '',
        limits: this.quotaFields.map(field => ({ ...field, limit: null })),
      };
      this.dialogConfigs.editQuotaGroup.visible = true;
    },
  },
};
