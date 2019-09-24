<template>
  <div class="org-quota">
    <div class="dao-view-main">
      <div class="dao-view-content">
        <div class="quota-section">
          <h4 class="quota-section-head">{{orgDescription}}总配额</h4>
          <quota-cards
            :hard="OrgQuota.hard"
            :sub-hard="OrgQuota.subHard"
            :scope="`${orgDescription}配额`"
            :sub-scope="`${spaceDescription}配额总和`"
            @refresh="getOrgAndSpaceQuotas"
          >
            <button
              class="dao-btn blue"
              slot="action"
              @click="applyDialog.visible = true"
            >申请{{orgDescription}}配额</button>
          </quota-cards>
        </div>
        <div class="quota-section">
          <h4 class="quota-section-head"> {{orgDescription}}下{{spaceDescription}}配额 </h4>
          <space-quota-table
            :loading="false"
            @refresh="getOrgAndSpaceQuotas"
            :space-quotas="spaceQuotas"
          >
          </space-quota-table>
        </div>
      </div>
    </div>
    <apply-update-quota-dialog
      :title="`申请更新${orgDescription}配额`"
      isApply
      remarkPlaceholder="请填写备注供超级管理员审批"
      helperTextPrefix="已分配可用区配额总和"
      :visible="applyDialog.visible"
      :loading="applyDialog.loading"
      :quota="OrgQuota"
      @submit="onApplyOrgQuota"
      @close="applyDialog.visible = false"
    ></apply-update-quota-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import QuotaCards from '@/view/components/resource-quota/quota-cards.vue';
import ApplyUpdateQuotaDialog from '@/view/components/resource-quota/apply-update-quota-dialog.vue';
import SpaceQuotaTable from '@/view/components/resource-quota/space-quota-table.vue';

import orgService from '@/core/services/org.service';

export default {
  name: 'org-quota',
  computed: {
    ...mapGetters(['orgDescription', 'spaceDescription']),
    ...mapState(['space', 'zone']),
  },
  components: {
    QuotaCards,
    ApplyUpdateQuotaDialog,
    SpaceQuotaTable,
  },
  data() {
    return {
      OrgQuota: {
        hard: {},
        subHard: {},
      },
      spaceQuotas: [],
      applyDialog: {
        visible: false,
        loading: false,
      },
    };
  },
  created() {
    this.getOrgAndSpaceQuotas();
  },
  methods: {
    getOrgAndSpaceQuotas() {
      this.getOrgQuota();
      this.getOrgSpaceQuota();
    },
    getOrgQuota() {
      orgService.getResourceQuota().then(res => {
        this.OrgQuota = {
          hard: res.hard,
          subHard: res.space_hards,
        };
      });
    },
    getOrgSpaceQuota() {
      orgService.getSpaceResourceQuotas().then(res => {
        this.spaceQuotas = res;
      });
    },
    onApplyOrgQuota(quota) {
      this.applyDialog.loading = true;
      orgService
        .applyResourceQuota(quota)
        .then(() => {
          this.$noty.success('申请已提交');
          this.applyDialog.visible = false;
        })
        .catch(err => {
          this.$noty.error('申请提交失败', err);
        })
        .finally(() => {
          this.applyDialog.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.org-quota {
  .quota-section {
    box-shadow: 0 1px 0 0 #e4e7ed;
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
