<template>
  <div>
    <div v-if="!serviceId">
      <div class="dao-view-main">
        <div class="dao-view-content">
          <div class="dao-setting-layout">
            <div class="empty-state permission-deny">
              <div class="empty-state-title">
                <svg><use xlink:href="#icon_connect-msg"></use></svg>
              </div>
              <div class="empty-state-message">
                <p>对不起, 该服务还未在 {{ zone.name }} 中上架。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="serviceId">
      <resource-header
        :selfDefined="true"
        :resource="resource">
      </resource-header>

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
                class="dao-btn blue has-icon"
                :disabled="loadings.instances || isZoneSyncing || isDeleted"
                v-if="$can('create')"
                @click="deployService">
                <svg class="icon">
                  <use xlink:href="#icon_plus-circled"></use>
                </svg>
                <span class="text">创建实例</span>
              </button>
            </div>
          </dao-table-view>
        </div>
      </div>
    </div>

    <error-info-dialog
      :text="selectedInstanceInfo"
      :visible="dialogConfigs.errorInfo.visible"
      @close="dialogConfigs.errorInfo.visible = false">
    </error-info-dialog>
  </div>
</template>

<script src="./instance-list.js">
</script>
