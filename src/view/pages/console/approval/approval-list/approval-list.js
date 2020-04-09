import { mapGetters } from 'vuex';
import { findIndex } from 'lodash';
import table from '@/view/mixins/table';
import ApprovalService from '@/core/services/approval.service';
import { APPROVAL_PROCESS_DONE, APPROVAL_PROCESS_REJECTED } from '@/core/constants/constants';

import ApprovalDetailDialog from '@/view/pages/dialogs/approval/approval-detail.vue';

export default {
  name: 'ApprovalList',

  extends: table('id', 10, 'updated_at'),

  components: {
    ApprovalDetailDialog,
  },

  created() {
    this.loadApprovalList();
  },

  data() {
    return {
      rows: [],
      loadings: {
        approvalList: false,
      },
      memberWithoutCompetence: false,
      dialogConfigs: {
        approval: {
          visible: false,
          approvalId: '', // selected approval
        },
      },
    };
  },

  computed: {
    ...mapGetters(['spaceId', 'isSpaceAdmin']),
  },

  methods: {
    filterMethod(data, filterKey) {
      return data.owner && data.owner.name.toLowerCase().includes(filterKey.toLowerCase());
    },
    doAgree(approval) {
      this.$tada
        .confirm({
          title: '同意审批',
          text: `
          创建者: ${approval.owner.name}
          服务类型: ${approval.service.name}
        `,
          primaryText: '同意',
          dangerMode: false,
        })
        .then(willAgree => {
          if (!willAgree) return;
          this.updateApproval(approval.approval_id, APPROVAL_PROCESS_DONE);
        });
    },

    doDisagree(approval) {
      this.$tada
        .confirm({
          title: '拒绝审批',
          text: `
        创建者: ${approval.owner.name}
        服务类型: ${approval.service.name}
      `,
          primaryText: '拒绝',
        })
        .then(willAgree => {
          if (!willAgree) return;
          this.updateApproval(approval.approval_id, APPROVAL_PROCESS_REJECTED);
        });
    },

    doWithdrawal(approval) {
      this.$tada
        .confirm({
          title: '撤销审批',
          text: [`创建者: ${approval.owner.name}`, `服务类型: ${approval.service.name}`].join('\n'),
          primaryText: '撤销',
        })
        .then(ok => {
          if (!ok) return;
          this.withdrawalApproval(approval.approval_id);
        });
    },

    loadApprovalList() {
      this.loadings.approvalList = true;
      ApprovalService.listApprovals()
        .then(items => {
          this.rows = items;
        })
        .finally(() => {
          this.loadings.approvalList = false;
        });
    },

    updateApproval(id, status) {
      ApprovalService.update(id, status).then(() => {
        const index = findIndex(this.rows, ['approval_id', id]);
        this.$noty.success('成功!');
        this.rows.splice(index, 1);
      });
    },

    withdrawalApproval(id) {
      ApprovalService.withdrawal(id).then(() => {
        const index = findIndex(this.rows, ['approval_id', id]);
        this.$noty.success('撤销成功!');
        this.rows.splice(index, 1);
      });
    },

    openApprovalDetail(approvalId) {
      this.dialogConfigs.approval.visible = true;
      this.dialogConfigs.approval.approvalId = approvalId;
    },
  },
};
