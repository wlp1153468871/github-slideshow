import { mapState, mapGetters } from 'vuex';
import { convert } from '@/core/utils';
import { PLANKEY, QUOTA_APPROVAL_STATUS } from '@/core/constants/constants';
import { max, find } from 'lodash';
import tableView from '@/view/mixins/table-view';
import QuotaService from '@/core/services/quota.service';
import SpaceService from '@/core/services/space.service';
// dialogs
import ApplyQuotaDialog from '@/view/pages/dialogs/quota/apply-quota';
import EditQuotaDialog from '@/view/pages/dialogs/broker-service/edit-quota';

export default {
  name: 'QuotaUsed',

  extends: tableView('id', 10, 'name'),

  components: {
    ApplyQuotaDialog,
    EditQuotaDialog,
  },

  data() {
    return {
      quotaStatus: QUOTA_APPROVAL_STATUS,
      rows: [],
      loading: true,
      space: { quota_usages: [] },
      quotaFields: [],
      quotaGroups: [],
      approvals: [],
      dialogConfigs: {
        applyQuota: { visible: false },
        editQuota: { visible: false },
        isConfirming: false,
        detail: { visible: false },
      },
      request: {},
      detailRequest: {},
    };
  },

  created() {
    this.initTableView();
    this.loadQuotaFields();
    this.loadSpace();
    this.loadSpaceUsedQuotaGroups();
    this.loadSpaceQuotaApprovals();
  },

  computed: {
    ...mapState(['org', 'user']),
    ...mapGetters(['spaceId', 'isOrganizationAdmin']),

    summaryQuota() {
      const { MEMORY } = PLANKEY;
      const { quotaFields, quotaGroups, space } = this;
      const { quota_usages } = space;
      const memory = find(quotaFields, { code: MEMORY });
      return quotaFields.map(field => {
        const {
          name, unit, id, code,
        } = field;
        const usage = quota_usages.find(x => x.quota_field_id === field.id);
        const groupFieldLimits = quotaGroups.map(group => {
          const { quota_group_limits = [] } = group;
          const fieldLimit = quota_group_limits.find(x => x.quota_field_id === id);
          return fieldLimit ? fieldLimit.limit : Infinity;
        });
        let limit = max(groupFieldLimits);
        let used;
        if (code === MEMORY) {
          used = usage && usage.in_use ? convert(usage.in_use, memory.unit) : 0;
          limit = limit === Infinity ? '' : convert(limit, memory.unit);
        } else {
          used = usage && usage.in_use ? usage.in_use : 0;
          limit = limit === Infinity ? '' : limit;
        }
        return {
          limit,
          code,
          name,
          unit,
          used,
          id,
        };
      });
    },

    requestDetails() {
      const details = [];
      if (!this.detailRequest.quota_extend_items) return details;
      const { MEMORY } = PLANKEY;
      this.detailRequest.quota_extend_items.forEach(({ quota_field, max_quota }) => {
        let requestValue = max_quota;
        if (quota_field.code === MEMORY) {
          requestValue = convert(requestValue, quota_field.unit);
        }
        details.push({
          label: quota_field.name,
          value: `${requestValue} ${quota_field.unit}`,
        });
      });
      return details;
    },
  },

  methods: {
    initTableView() {
      this.setTableConfig({
        hideSearchInput: true,
      });

      this.setTableProps([
        { id: 'owner', name: '请求人', value: 'owner.username' },
        { id: 'space', name: '项目组', value: 'space.name' },
        { id: 'process_status', name: '状态', filter: 'quota_approval' },
        { id: 'created_at', name: '申请时间', filter: 'unix_date' },
      ]);

      const invisible = item => !item.is_handled;
      const visible = item => item.is_handled;
      this.setTableOperations([
        {
          name: '查看详情',
          event: 'open-detail-dialog',
          visible,
        },
        {
          name: '同意审批',
          event: 'open-agree-dialog',
          disabled: !this.isOrganizationAdmin,
          tooltip: '您没有权限进行审批',
          visible: invisible,
        },
        {
          name: '拒绝审批',
          event: 'confirm-disagree',
          disabled: !this.isOrganizationAdmin,
          tooltip: '您没有权限进行审批',
          visible: invisible,
        },
      ]);
    },

    openAgreeDialog(item) {
      this.request = item;
      this.dialogConfigs.editQuota.visible = true;
    },

    confirmDisagree(item) {
      this.$tada
        .confirm({
          title: '拒绝配额申请',
          text: '您确定要拒绝该配额申请吗？',
          primaryText: '拒绝',
          primaryLevel: 'danger',
        })
        .then(yes => {
          if (yes) {
            const data = {
              process_status: 'reject',
              quota_extend_items: item.quota_extend_items.map(quota => ({
                max_quota: Number(quota.max_quota),
                quota_field_id: quota.quota_field_id,
              })),
            };
            this.applyRequest({
              approvalId: item.approval_id,
              data,
            });
          }
        });
    },

    applyRequest(request) {
      this.dialogConfigs.isConfirming = true;
      QuotaService.updateSpaceQuotaApproval(
        this.spaceId,
        request.approvalId,
        request.data,
      )
        .then(() => {
          this.$noty.success('配额修改成功');
          this.$emit('update-quota');
          this.closeDialog();
          this.loadSpaceUsedQuotaGroups();
          this.loadSpaceQuotaApprovals();
        })
        .finally(() => {
          this.dialogConfigs.isConfirming = false;
        });
    },

    closeDialog() {
      this.dialogConfigs.editQuota.visible = false;
    },

    loadQuotaFields() {
      QuotaService.listQuotaFields().then(fields => {
        this.quotaFields = fields;
      });
    },

    loadSpace() {
      SpaceService.getSpace(this.spaceId).then(space => {
        this.space = space;
      });
    },

    loadSpaceUsedQuotaGroups() {
      QuotaService.getSpaceUsedQuotaGroup(this.spaceId).then(groups => {
        this.quotaGroups = groups.map(x => x.quota_group);
      });
    },

    loadSpaceQuotaApprovals() {
      this.loading = true;
      QuotaService.listSpaceQuotaApprovals(this.spaceId).then(approvals => {
        this.approvals = approvals;
        this.rows = approvals;
        this.loading = false;
      });
    },

    onCheckedRowsChange() {
      // TODO(jerry): show quota-approval details
    },

    openAddQutoaGroupDialog() {
      const unHandledRequest = this.rows.filter(request => !request.is_handled);
      if (unHandledRequest.length) {
        this.$tada.error('您还有正在审批的申请');
      } else {
        this.dialogConfigs.applyQuota.visible = true;
      }
    },

    onQuotaChange(quotas) {
      const approval = {
        quota_extend_items: quotas,
      };
      return QuotaService.createSpaceQuotaApproval(this.spaceId, approval).then(() => {
        this.loadSpaceQuotaApprovals();
        this.$noty.success('申请配额成功');
      });
    },

    openDetailDialog(request) {
      this.detailRequest = request;
      this.dialogConfigs.detail.visible = true;
    },
  },
};
