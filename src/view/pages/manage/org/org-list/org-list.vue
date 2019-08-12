<template>
  <div>
    <div class="layout-content-header bg-white">
      租户管理
    </div>
    <div class="dao-view-main">
      <div class="dao-view-content">
        <dao-table-view
          :rows="rows"
          :config="tConfig"
          :loading="loadings.orgs"
          @refresh="loadOrgs">
          <div slot="tool" class="dao-table-view-left-bar">
            <button
              class="dao-btn has-icon blue"
              @click="addOrgDialog()">
              <svg class="icon">
                <use xlink:href="#icon_plus-circled"></use>
              </svg>
              <span class="text">添加租户</span>
            </button>
          </div>
        </dao-table-view>
      </div>
    </div>
    <add-org-dialog
      :visible="dialogConfigs.addOrg.visible"
      @create="createOrg"
      @close="dialogConfigs.addOrg.visible = false">
    </add-org-dialog>
  </div>
</template>

<script src="./org-list.js"></script>
