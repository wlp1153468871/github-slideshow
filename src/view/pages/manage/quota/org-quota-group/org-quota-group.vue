<template>
  <div>
    <div class="layout-content-header">
      租户配额组
    </div>
    <div class="dao-view-main">
      <div class="dao-view-content">
        <dao-table-view
          :rows="rows"
          :config="tConfig"
          :loading="loadings.listQuotaGroups"
          @refresh="loadQuotaGroups"
          @checked-rows-change="onCheckedRowsChange"
          @confirm-delete-quota-group="confirmDeleteQuotaGroup"
          @open-update-quota-group-dialog="openUpdateQuotaGroupDialog">
          <div slot="tool">
            <button
              class="dao-btn blue has-icon"
              @click="openCreateQuotaGroupDialog()">
              <svg class="icon">
                <use xlink:href="#icon_plus-circled"></use>
              </svg>
              <span class="text">创建配额组</span>
            </button>
          </div>
        </dao-table-view>
      </div>
    </div>
    <div class="fixed-bottom-panels">
      <dao-panel
        size="l"
        class="bottom-body"
        :visible.sync="panelConfigs.visible">
        <dao-panel-item heading="配额详情">
          <dao-info-sheet
            style="width: 50%"
            :table="planDetail.table">
          </dao-info-sheet>
        </dao-panel-item>
      </dao-panel>
    </div>
    <!-- dialog start -->
    <edit-quota-group-dialog
      :quota-group="quotaGroup"
      :edit-type="editType"
      :title="editTypeDesc"
      :visible="dialogConfigs.editQuotaGroup.visible"
      :is-creating="isCreating"
      @create="onCreateQuotaGroup"
      @update="confirmUpdateQuotaGroup"
      @close="closeQuotaDialog">
    </edit-quota-group-dialog>
    <!-- dialog end -->
  </div>
</template>

<script src="./org-quota-group.js">
</script>
