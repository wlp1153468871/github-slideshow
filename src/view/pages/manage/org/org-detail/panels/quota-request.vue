<template>
  <div class="org-quota-request">
    <dao-table-view
      :rows="rows"
      :config="tConfig"
      @open-agree-dialog="openAgreeDialog"
      @confirm-disagree="confirmDisagree">
    </dao-table-view>

    <!-- dialog start -->
    <edit-quota-dialog
      :request="request"
      :visible="dialogConfigs.editQuota.visible"
      :is-confirming="dialogConfigs.isConfirming"
      @apply="applyRequest"
      @close="closeDialog">
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
    orgId: { type: String, default: '' },
  },
  created() {
    this.initTable();
  },
  watch: {
    orgId: {
      immediate: true,
      handler(orgId, prevOrgId) {
        if (orgId !== '' && orgId !== prevOrgId) {
          this.loadQuotaRequests();
        }
      },
    },
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
        orgs: false,
      },
    };
  },
  methods: {
    closeDialog() {
      this.dialogConfigs.editQuota.visible = false;
    },

    initTable() {
      this.setTableConfig({
        hideToolbar: true,
      });
      this.setTableProps([
        { id: 'owner', name: '请求人', value: 'owner.username' },
        { id: 'space', name: '项目组', value: 'space.name' },
        { id: 'created_at', name: '请求时间', filter: 'unix_date' },
      ]);

      this.setTableOperations([
        { name: '同意审批', event: 'open-agree-dialog' },
        { name: '拒绝审批', event: 'confirm-disagree' },
      ]);
    },

    loadQuotaRequests() {
      this.loadings.orgs = true;
      QuotaService.listOrgQuotaApprovals(this.orgId).then(list => {
        this.loadings.orgs = false;
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
      QuotaService.updateOrgExtendQuota(
        request.orgId,
        request.approvalId,
        request.data,
      )
        .then(() => {
          this.$noty.success('配额修改成功');
          const index = findIndex(this.rows, 'id', request.approval_id);
          this.rows.splice(index, 1);
          this.closeDialog();
        })
        .catch(() => {
          this.$noty.error('配额修改错误');
        })
        .finally(() => {
          this.dialogConfigs.isConfirming = false;
        });
    },

    confirmDisagree(item) {
      this.$tada
        .confirm({
          title: '拒绝配额申请',
          text: '您确定要拒绝该配额申请吗？',
          primaryText: '拒绝',
          primaryLevel: 'danger',
        })
        .then(willDelete => {
          if (willDelete) {
            const data = {
              approval_id: item.id,
              process_status: 'reject',
              quotas: item.quota_extend_items.map(approval => ({
                approval_id: approval.id,
                max_quota: Number(approval.max_quota),
              })),
            };
            this.applyRequest(item.approval_id, data);
          }
        });
    },
  },
};
</script>

<style lang="scss">
.org-quota-request {
  .right {
    display: none;
  }
}
</style>
