import { mapGetters } from 'vuex';
import table from '@/view/mixins/table';
import ApprovalService from '@/core/services/approval.service';
import {
  APPROVAL_PROCESS_DONE,
  APPROVAL_PROCESS_REJECTED,
  APPROVAL_PROCESS_CANCEL,
} from '@/core/constants/constants';

export default {
  name: 'ApprovalHistory',
  extends: table('id', 10, 'created_at'),
  created() {
    this.loadApprovalHistroy();
  },
  data() {
    return {
      // table mixin
      rows: [],
      APPROVAL_PROCESS_DONE,
      APPROVAL_PROCESS_REJECTED,
      APPROVAL_PROCESS_CANCEL,
      loadings: {
        approvalHistory: false,
      },
    };
  },
  computed: {
    ...mapGetters(['spaceId']),
  },
  methods: {
    loadApprovalHistroy() {
      this.loadings.approvalHistory = true;
      ApprovalService.history(this.spaceId).then((approvals = []) => {
        this.rows = approvals.map(this.parseApprovalItem);
      }).finally(() => {
        this.loadings.approvalHistory = false;
      });
    },

    parseApprovalItem(item) {
      const { decisions = [] } = item;
      const creator = decisions.map(user => user.name).join('，');
      item.creator = creator; // dirty changed!
      return item;
    },

    filterMethod(data, filterKey) {
      return data.owner && data.owner.name.toLowerCase().includes(filterKey.toLowerCase());
    },
  },
};
