<template>
  <div class="space-quota">
    <div class="layout-content-header">
      配额管理
    </div>
    <div class="dao-view-main">
      <div class="dao-view-content">
        <div class="quota-section">
          <h4 class="quota-section-head">{{spaceDescription}}总配额</h4>
          <quota-cards
            :hard="spaceQuota.hard"
            :sub-hard="spaceQuota.subHard"
            :scope="`${spaceDescription}配额`"
            sub-scope="可用区配额总和"
            @refresh="getSpaceQuota"
          >
            <button
              class="dao-btn blue"
              slot="action"
              :loading="true"
              @click="applyDialog.visible = true"
              v-if="isAdmin"
            >
              申请{{spaceDescription}}配额
            </button>
          </quota-cards>
          <p
            style="color: red; padding-bottom: 15px;"
            v-if="warning.length > 0"
          >
            检测到该{{spaceDescription}}下的【{{warning.join('、')}}】可用区
            配额总和大于{{spaceDescription}}的当前配额，
            可能是底层错误修改了配额，请更新可用区或{{spaceDescription}}配额以保证可用区配额的总和小于{{spaceDescription}}配额。
          </p>
        </div>
        <div
          class="quota-section"
          v-if="!zoneUnauthorized || isPlatformAdmin"
        >
          <h4 class="quota-section-head"> {{ zone.name }} 可用区配额</h4>
          <quota-cards
            :hard="zoneQuota.hard"
            :sub-hard="zoneQuota.subHard"
            @refresh="getZoneQuota"
            scope="可用区配额"
            sub-scope="已使用"
          >
            <button
              class="dao-btn blue"
              slot="action"
              @click="updateDialog.visible = true"
              v-if="isAdmin && $can('update')"
            >更新可用区配额</button>
          </quota-cards>
          <p
            style="color: red; padding-bottom: 15px;"
            v-if="zoneWarning.length > 0"
          >
            检测到该{{zone.name}}可用区的【{{zoneWarning.join('、')}}】已用
            资源大于配额。
          </p>
        </div>
        <div
          class="quota-section"
          v-if="isAdmin"
        >
          <h4 class="quota-section-head"> {{spaceDescription}}配额更新请求 </h4>
          <quota-approval-table
            :loading="quotaApprovalLoading"
            :approvals="quotaApproval"
            :showSpaceCol="false"
            @refresh="getSpaceQuotaApplyList"
            type="apply"
          >
          </quota-approval-table>
        </div>
      </div>
    </div>
    <apply-update-quota-dialog
      :title="`申请更新${spaceDescription}配额`"
      isApply
      :remarkPlaceholder="`请填写备注供${orgDescription}管理员审批`"
      helperTextPrefix="已分配可用区配额总和"
      :visible="applyDialog.visible"
      :quota="spaceQuota"
      :loading="applyDialog.loading"
      @submit="onApplySpaceQuota"
      @close="applyDialog.visible = false"
    ></apply-update-quota-dialog>
    <apply-update-quota-dialog
      title="更新可用区配额"
      helperTextPrefix="已使用"
      @submit="onUpdateZoneQuota"
      :quota="zoneQuota"
      :loading="updateDialog.loading"
      :visible="updateDialog.visible"
      @close="updateDialog.visible = false"
    ></apply-update-quota-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { get as gatValue } from 'lodash';

import QuotaCards from '@/view/components/resource-quota/quota-cards.vue';
import ApplyUpdateQuotaDialog from '@/view/components/resource-quota/apply-update-quota-dialog.vue';
import QuotaApprovalTable from '@/view/components/resource-quota/quota-approval-table.vue';

import spaceService from '@/core/services/space.service';
import zoneService from '@/core/services/zone.service';

export default {
  name: 'space-quota',
  computed: {
    ...mapState(['space', 'zone']),
    ...mapGetters([
      'isSpaceAdmin',
      'isPlatformAdmin',
      'isOrganizationAdmin',
      'zoneUnauthorized',
      'spaceDescription',
      'orgDescription',
    ]),
    isAdmin() {
      return this.isSpaceAdmin || this.isPlatformAdmin || this.isOrganizationAdmin;
    },
    zoneWarning() {
      const compareStringInt = (a, b) => parseFloat(a, 10) > parseFloat(b, 10);
      const w = [];
      if (compareStringInt(this.zoneQuota.subHard.cpu, this.zoneQuota.hard.cpu)) {
        w.push('CPU');
      }
      if (compareStringInt(this.zoneQuota.subHard.memory, this.zoneQuota.hard.memory)) {
        w.push('内存');
      }
      if (compareStringInt(this.zoneQuota.subHard.storage, this.zoneQuota.hard.storage)) {
        w.push('存储');
      }
      return w;
    },
    warning() {
      const compareStringInt = (a, b) => parseFloat(a, 10) > parseFloat(b, 10);
      const w = [];
      if (compareStringInt(this.spaceQuota.subHard.cpu, this.spaceQuota.hard.cpu)) {
        w.push('CPU');
      }
      if (compareStringInt(this.spaceQuota.subHard.memory, this.spaceQuota.hard.memory)) {
        w.push('内存');
      }
      if (compareStringInt(this.spaceQuota.subHard.storage, this.spaceQuota.hard.storage)) {
        w.push('存储');
      }
      return w;
    },
  },
  created() {
    this.getSpaceQuota();
    if (!this.zoneUnauthorized || this.isPlatformAdmin) this.getZoneQuota();
    this.getSpaceQuotaApplyList();
  },
  components: {
    QuotaCards,
    ApplyUpdateQuotaDialog,
    QuotaApprovalTable,
  },
  data() {
    return {
      spaceQuota: {
        hard: {
          // 项目组配额
        },
        subHard: {
          // 已分配给可用区配额总和
        },
      },
      zoneQuota: {
        hard: {},
        subHard: {},
      },
      quotaApproval: [],
      quotaApprovalLoading: false,
      applyDialog: {
        visible: false,
        loading: false,
      },
      updateDialog: {
        loading: false,
        visible: false,
      },
    };
  },
  methods: {
    getSpaceQuota() {
      spaceService.getResourceQuota().then(res => {
        this.spaceQuota = {
          hard: res.hard,
          subHard: res.zone_hards,
        };
      });
    },
    getZoneQuota() {
      zoneService.getResourceQuota().then(res => {
        const hard = gatValue(res, 'status.hard', {});
        const used = gatValue(res, 'status.used', {});
        this.zoneQuota = {
          hard: {
            cpu: hard['limits.cpu'],
            memory: hard['limits.memory'],
            storage: hard['requests.storage'],
          },
          subHard: {
            cpu: used['limits.cpu'],
            memory: used['limits.memory'],
            storage: used['requests.storage'],
          },
        };
      });
    },
    onApplySpaceQuota(quota) {
      this.applyDialog.loading = true;
      spaceService
        .applyResourceQuota(quota)
        .then(() => {
          this.$noty.success('申请已提交');
          this.getSpaceQuotaApplyList();
          this.applyDialog.visible = false;
        })
        .catch(err => {
          this.$noty.error('申请提交失败', err);
        })
        .finally(() => {
          this.applyDialog.loading = false;
        });
    },
    newQuotaGreaterThanResource(quota) {
      const isLarge = key => {
        const oldQuota = parseFloat(this.zoneQuota.hard[key]);
        let newQuota = parseFloat(quota[key]);
        if (key === 'cpu') {
          newQuota *= 1000;
        } else {
          newQuota *= 1024 ** 3;
        }
        const spacelimit = parseFloat(this.spaceQuota.hard[key]);
        const allZoneUsed = parseFloat(this.spaceQuota.subHard[key]);
        // eslint-disable-next-line no-mixed-operators
        return allZoneUsed - oldQuota + newQuota > spacelimit;
      };
      return isLarge('cpu') || isLarge('memory') || isLarge('storage');
    },
    onUpdateZoneQuota(quota) {
      if (this.newQuotaGreaterThanResource(quota)) {
        this.$noty.error(`${this.spaceDescription}配额不足`);
        return;
      }
      this.updateDialog.loading = true;
      zoneService
        .updateResourceQuota(quota)
        .then(() => {
          this.$noty.success('可用区配额更新成功');
          this.getZoneQuota();
          this.getSpaceQuota();
          this.updateDialog.visible = false;
        })
        .catch(err => {
          this.$noty.error('可用区配额更新失败', err);
        })
        .finally(() => {
          this.updateDialog.loading = false;
        });
    },
    getSpaceQuotaApplyList() {
      if (!this.isAdmin) {
        return;
      }
      this.quotaApprovalLoading = true;
      spaceService
        .getResourceQuotaApprovals()
        .then(res => {
          this.quotaApproval = res;
        })
        .finally(() => {
          this.quotaApprovalLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.space-quota {
  .quota-section {
    box-shadow: 0 1px 0 0 #e4e7ed;
    margin-bottom: 15px;
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
