<template>
  <div class="org-quota-approval">
    <div class="dao-view-main">
      <div class="dao-view-content">
        <quota-approval-table
          :canUpdate="$can('platform.organization.approval')"
          :loading="false"
          :approvals="quotaRequests"
          @refresh="getZoneApprovals"
          type="approval"
          scope="org"
        >
        </quota-approval-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import QuotaApprovalTable from '@/view/components/resource-quota/quota-approval-table.vue';
import orgService from '@/core/services/org.service';

export default {
  name: 'org-quota-approval',
  computed: {
    ...mapState(['space', 'zone']),
  },
  components: {
    QuotaApprovalTable,
  },
  data() {
    return {
      orgId: this.$route.params.org,
      quotaRequests: [],
    };
  },
  created() {
    if (this.$can('platform.organization.approval')) {
      this.getZoneApprovals();
    } else {
      this.$noty.error('您暂无租户审批权限');
    }
  },
  methods: {
    getZoneApprovals() {
      orgService.getResourceQuotaApprovals(this.orgId, 'approve').then(res => {
        this.quotaRequests = res;
      });
    },
  },
};
</script>
