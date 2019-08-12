<template>
  <div>
    <resource-header :resource="service"></resource-header>

    <div class="dao-view-main">
      <div class="dao-view-content">
        <dao-table-view
          ref="tableView"
          :rows="rows"
          :config="tConfig"
          :loading="loadings.instances"
          @refresh="loadInstances"
          @remove-confirm="ensureRemove">
          <div slot="tool" class="dao-table-view-left-bar">
            <button
              v-if="$can('create')"
              class="dao-btn has-icon blue"
              :disabled="loadings.instances || isZoneSyncing"
              @click="deployApplication()">
              <svg class="icon">
                <use xlink:href="#icon_plus-circled"></use>
              </svg>
              <span class="text">部署应用</span>
            </button>
          </div>
        </dao-table-view>
      </div>
    </div>

    <error-info-dialog
      :text="selectedInstanceInfo"
      :visible="dialogConfigs.errorInfo.visible"
      @close="dialogConfigs.errorInfo.visible = false">
    </error-info-dialog>
  </div>
</template>

<script src="./app-list.js"></script>
