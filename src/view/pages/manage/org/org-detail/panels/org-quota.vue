<template>
  <div class="org-quota">
    <div class="dao-view-main" v-if="$can('platform.organization.quota')">
      <div class="dao-view-content">
        <div class="quota-section">
          <h4 class="quota-section-head">{{ orgDescription }}总配额</h4>
          <quota-cards
            :hard="OrgQuota.hard"
            :sub-hard="OrgQuota.subHard"
            @refresh="getOrgAndSpaceQuotas"
            :scope="`${orgDescription}配额`"
            :sub-scope="`${spaceDescription}配额总和`"
          >
            <button class="dao-btn blue" slot="action" @click="updateDialog.visible = true">
              更新配额
            </button>
          </quota-cards>
        </div>
        <div class="quota-section">
          <h4 class="quota-section-head">{{ orgDescription }}下{{ spaceDescription }}配额</h4>
          <space-quota-table
            :canUpdate="$can('platform.organization.quota')"
            :loading="tableLoading"
            @refresh="getOrgAndSpaceQuotas"
            :space-quotas="spaceQuotas"
          >
          </space-quota-table>
        </div>
      </div>
    </div>
    <apply-update-quota-dialog
      :title="`更新${orgDescription}配额`"
      :isApply="false"
      helperTextPrefix="已分配可用区配额总和"
      :visible="updateDialog.visible"
      :loading="updateDialog.loading"
      :quota="OrgQuota"
      @submit="onUpdateOrgQuota"
      @close="updateDialog.visible = false"
    ></apply-update-quota-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import QuotaCards from '@/view/components/resource-quota/quota-cards.vue';
import ApplyUpdateQuotaDialog from '@/view/components/resource-quota/apply-update-quota-dialog.vue';
import SpaceQuotaTable from '@/view/components/resource-quota/space-quota-table.vue';
import orgService from '@/core/services/org.service';

export default {
  name: 'org-quota',
  components: {
    QuotaCards,
    ApplyUpdateQuotaDialog,
    SpaceQuotaTable,
  },
  props: ['tab', 'defautlTab'],
  watch: {
    tab(value) {
      if (value === this.defautlTab) {
        this.getOrgAndSpaceQuotas();
      }
    },
  },
  computed: {
    ...mapGetters(['orgDescription', 'spaceDescription']),
  },
  data() {
    return {
      OrgQuota: {
        hard: {},
        subHard: {},
      },
      orgId: this.$route.params.org,
      spaceQuotas: [],
      tableLoading: false,
      updateDialog: {
        visible: false,
        loading: false,
      },
    };
  },
  created() {
    if (this.$can('platform.organization.quota')) {
      this.getOrgAndSpaceQuotas();
    } else {
      this.$noty.error('暂无租户配额相关权限');
    }
  },
  methods: {
    getOrgAndSpaceQuotas() {
      this.getOrgQuota();
      this.getOrgSpaceQuota();
    },
    onUpdateOrgQuota(quota) {
      this.updateDialog.loading = true;
      orgService
        .updateResourceQuota(this.orgId, quota)
        .then(() => {
          this.$noty.success('更新成功');
          this.getOrgAndSpaceQuotas();
          this.updateDialog.visible = false;
        })
        .catch(err => {
          this.$noty.error('更新失败', err);
        })
        .finally(() => {
          this.updateDialog.loading = false;
        });
    },
    getOrgQuota() {
      orgService.getResourceQuota(this.orgId).then(res => {
        this.OrgQuota = {
          hard: res.hard,
          subHard: res.space_hards,
        };
      });
    },
    getOrgSpaceQuota() {
      this.tableLoading = true;
      orgService
        .getSpaceResourceQuotas(this.orgId)
        .then(res => {
          this.spaceQuotas = res;
        })
        .finally(() => {
          this.tableLoading = false;
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
  .quota-section-head {
    font-weight: 500;
    font-size: 16px;
    color: #303133;
    padding: 0px 0 15px;
  }
}
</style>
