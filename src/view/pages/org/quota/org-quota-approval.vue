<template>
  <div class="org-quota-approval">
    <div class="dao-view-main">
      <div class="dao-view-content">
        <div class="quota-section">
          <h4 class="quota-section-head">{{ spaceDescription }}配额审批</h4>
          <quota-approval-table
            :loading="approvalLoading"
            :approvals="quotaApproval"
            :showSpaceCol="true"
            @refresh="getSpaceApprovals"
            type="approval"
            scope="space"
          >
          </quota-approval-table>
        </div>
        <div class="quota-section">
          <h4 class="quota-section-head">{{ orgDescription }}配额审批</h4>
          <quota-approval-table
            :loading="requestLoading"
            @refresh="getOrgApprovals"
            :approvals="quotaRequests"
            type="apply"
            scope="org"
          >
          </quota-approval-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import QuotaApprovalTable from '@/view/components/resource-quota/quota-approval-table.vue';

import spaceService from '@/core/services/space.service';
import orgService from '@/core/services/org.service';

export default {
  name: 'org-quota-approval',
  computed: {
    ...mapGetters(['orgDescription', 'spaceDescription']),
    ...mapState(['space', 'zone']),
  },
  components: {
    QuotaApprovalTable,
  },
  data() {
    return {
      quotaApproval: [],
      approvalLoading: false,
      quotaRequests: [],
      requestLoading: false,
    };
  },
  created() {
    this.getSpaceApprovals();
    this.getOrgApprovals();
  },
  methods: {
    getSpaceApprovals() {
      this.approvalLoading = true;
      spaceService
        .getResourceQuotaApprovals('approve')
        .then(res => {
          this.quotaApproval = res;
        })
        .finally(() => {
          this.approvalLoading = false;
        });
    },
    getOrgApprovals() {
      this.requestLoading = true;
      orgService
        .getResourceQuotaApprovals()
        .then(res => {
          this.quotaRequests = res;
        })
        .finally(() => {
          this.requestLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.org-quota-approval {
  .quota-section {
    box-shadow: 0 1px 0 0 #e4e7ed;
    margin-bottom: 15px;
    &:nth-last-child(1) {
      box-shadow: none;
    }
  }
  .quota-cards {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    list-style: none;
    margin-bottom: 15px;
  }
  .quota-section-head {
    font-weight: 500;
    font-size: 16px;
    color: #303133;
    padding: 0px 0 15px;
  }
  .quota-action {
    position: absolute;
    right: 10px;
    top: -40px;
  }
}
</style>
