<template>
  <div>
    <div class="layout-content-header">
      可用区设置
    </div>
    <div class="dao-view-main">
      <div class="dao-view-content">
        <dao-table-view
          :rows="rows"
          :config="tConfig"
          :loading="loadings.zone"
          @refresh="loadZones"
          @update-zone="updateZone"
          @confirm-enable="confirmEnable"
          @confirm-disable="confirmDisable">
          <div slot="tool" class="dao-table-view-left-bar">
            <button
              class="dao-btn has-icon blue"
              @click="deployZone">
              <svg class="icon">
                <use xlink:href="#icon_plus-circled"></use>
              </svg>
              <span class="text">创建可用区</span>
            </button>
          </div>
        </dao-table-view>
      </div>
    </div>
  </div>
</template>

<script src="./zone-list.js">
</script>
