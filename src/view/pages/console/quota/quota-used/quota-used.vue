<template>
  <div class="page-quota">
    <div class="layout-content-header">
      配额管理
    </div>
    <quota-gallery :quotas="summaryQuota"></quota-gallery>
    <!--<div class="dao-view-main">
      <div class="dao-view-content">
        <dao-table-view
          :loading="loading"
          :rows="rows"
          :config="tConfig"
          @refresh="loadSpaceQuotaApprovals"
          @checked-rows-change="onCheckedRowsChange"
          @open-agree-dialog="openAgreeDialog"
          @open-detail-dialog="openDetailDialog"
          @confirm-disagree="confirmDisagree">
          <div slot="tool" class="dao-table-view-left-bar">
            <button
              class="dao-btn white has-icon"
              @click="openAddQutoaGroupDialog">
              <svg class="icon">
                <use xlink:href="#icon_plus-circled"></use>
              </svg>
              <span class="text">申请配额</span>
            </button>
          </div>
        </dao-table-view>
      </div>
    </div>-->

    <!-- dailog start -->
    <apply-quota-dialog
      ref="applyQuotaDialog"
      :quotas="summaryQuota"
      @on-change="onQuotaChange"
      :visible="dialogConfigs.applyQuota.visible"
      @close="dialogConfigs.applyQuota.visible = false">
    </apply-quota-dialog>

    <edit-quota-dialog
      :request="request"
      :visible="dialogConfigs.editQuota.visible"
      :is-confirming="dialogConfigs.isConfirming"
      @apply="applyRequest"
      @close="closeDialog">
    </edit-quota-dialog>

    <dao-dialog :visible.sync="dialogConfigs.detail.visible" header="查看配额详情">
      <dao-setting-layout>
        <template #layout-title>
          <dsp-alert
            v-if="detailRequest.process_status === quotaStatus.FINISH"
            message="审批已通过"
            type="success"
            show-icon>
          </dsp-alert>
          <dsp-alert
            v-if="detailRequest.process_status === quotaStatus.REJECT"
            message="审批已拒绝"
            type="error"
            show-icon>
          </dsp-alert>
        </template>
        <dao-setting-section
          v-for="(request, index) in requestDetails"
          :key="index">
          <template #label>{{ request.label }}</template>
          <template #content>
            {{ request.value }}
          </template>
          <template slot="content-helper">
          </template>
        </dao-setting-section>
      </dao-setting-layout>
    </dao-dialog>
    <!-- dialog end -->

  </div>
</template>

<script src="./quota-used.js">
</script>

<style lang="scss">
.page-quota {
  .daox-setting-title {
    width: 100%;
  }
}
</style>
