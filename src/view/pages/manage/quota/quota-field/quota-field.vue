<template>
  <div>
    <div class="layout-content-header">
      配额字段管理
    </div>
    <div class="dao-view-main">
      <div class="dao-view-content">
        <dao-table-view
          :rows="rows"
          :config="tConfig"
          :loading="loadings.listQuotaField"
          @refresh="loadQuotaFields"
          @create-quota-field="createQuotaFieldShow"
          @update-quota-field="updateQuotaField"
          @confirm-delete-quota-field="confirmDeleteQuotaField"
          @open-update-quota-field-dialog="openUpdateQuotaFieldDialog">
          <div slot="tool">
            <button
              class="dao-btn has-icon blue"
              @click="createQuotaFieldShow">
              <svg class="icon"><use xlink:href="#icon_plus-circled"></use></svg>
              <span class="text">创建配额字段</span>
            </button>
          </div>
        </dao-table-view>
      </div>
    </div>
    <!-- dialog start -->
    <create-quota-field-dialog
      ref="createQutoaFieldDialog"
      @create="createQuotaField"
      :visible="dialogConfigs.createQuotaField.visible"
      @close="dialogConfigs.createQuotaField.visible = false">
    </create-quota-field-dialog>
    <update-quota-field-dialog
      ref="updateQutoaFieldDialog"
      :quota-field="quotaField"
      @update="updateQuotaField"
      :visible="dialogConfigs.updateQuotaField.visible"
      @close="dialogConfigs.updateQuotaField.visible = false">
    </update-quota-field-dialog>
    <!-- dialog end -->
  </div>
</template>

<script src="./quota-field.js"></script>
