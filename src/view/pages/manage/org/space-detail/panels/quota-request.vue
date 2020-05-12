<template>
  <div class="space-quota-request">
    <dao-table-view
      :rows="rows"
      :config="tConfig"
      @refresh="loadQuotaRequests"
      @open-agree-dialog="openAgreeDialog"
      @confirm-disagree="confirmDisagree"
    >
    </dao-table-view>

    <!-- dialog start -->
    <edit-quota-dialog
      :request="request"
      :visible="dialogConfigs.editQuota.visible"
      :is-confirming="dialogConfigs.isConfirming"
      @apply="applyRequest"
      @close="closeDialog"
    >
    </edit-quota-dialog>
    <!-- dialog end -->
  </div>
</template>

<script>
import { findIndex } from 'lodash';
import tableView from '@/view/mixins/table-view';
import QuotaService from '@/core/services/quota.service';
import EditQuotaDialog from '@/view/pages/dialogs/broker-service/edit-quota';

export default {
  name: 'QuotaRequest',
  extends: tableView('id', 10, 'created_at', 'desc'),
  components: {
    EditQuotaDialog,
  },
  props: {
    spaceId: { type: String, default: () => '' },
  },
  data() {
    return {
      rows: [],
      request: {}, // selected quota request
      requests: {},
      dialogConfigs: {
        editQuota: { visible: false },
        isConfirming: false,
      },
      loadings: {
        spaces: false,
      },
    };
  },
  created() {
    this.loadQuotaRequests();

    this.setTableConfig({
      hideToolbar: true,
    });
    this.setTableProps([
      { id: 'owner', name: '请求人', value: 'owner.username' },
      { id: 'space', name: '项目组', value: 'space.name' },
      { id: 'updated_at', name: '请求时间', filter: 'unix_date' },
    ]);
    this.setTableOperations([
      { name: '同意审批', event: 'open-agree-dialog' },
      { name: '拒绝审批', event: 'confirm-disagree' },
    ]);
  },
  methods: {
    loadQuotaRequests() {
      this.loadings.spaces = true;
      QuotaService.listSpaceQuotaApprovals(this.spaceId).then(list => {
        this.loadings.spaces = false;
        this.requests = list;
        this.rows = list;
      });
    },

    openAgreeDialog(item) {
      this.request = item;
      this.dialogConfigs.editQuota.visible = true;
    },

    applyRequest(request) {
      this.dialogConfigs.isConfirming = true;
      QuotaService.updateSpaceQuotaApproval(this.spaceId, request.approvalId, request.data)
        .then(() => {
          this.$noty.success('配额修改成功');
          const index = findIndex(this.rows, ['approval_id', request.approvalId]);
          this.rows.splice(index, 1);
          this.$emit('update-quota');
          this.closeDialog();
        })
        .finally(() => {
          this.dialogConfigs.isConfirming = false;
        });
    },

    closeDialog() {
      this.dialogConfigs.editQuota.visible = false;
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
  },
};
</script>

<style lang="scss" scoped>
.space-quota-request {
  .right {
    display: none;
  }
}
</style>
