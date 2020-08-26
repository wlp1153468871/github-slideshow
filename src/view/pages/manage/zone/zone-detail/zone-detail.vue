<template>
  <div>
  <div class="page-manage" v-if="showAdd">
    <circle-loading v-if="loading"></circle-loading>

    <template v-else>
      <div class="layout-content-header bg-white">
        <breadcrumb
          :links="[
            { text: '可用区列表', route: { name: 'manage.zone.list' } },
            { text: zone.name },
          ]"
        >
        </breadcrumb>
      </div>

      <el-tabs v-model="currentTab" class="zone-tab">
        <el-tab-pane :label="TABS.APPLICATION" :name="TABS.APPLICATION">
          <AppList :id="zone.id" @addApplication="addApplication"></AppList>
        </el-tab-pane>
        <el-tab-pane :label="TABS.CHART" :name="TABS.CHART">
          <ChartList :id="zone.id"></ChartList>
<!--          <newApp></newApp>-->
        </el-tab-pane>
        <el-tab-pane :label="TABS.BINDS" :name="TABS.BINDS">
          <manage-panel
            :zone="zone"
            :loading="loading"
            v-model="selectedBroker"
            @refresh="loadCatalog"
            @syncService="syncService"
          >
          </manage-panel>
        </el-tab-pane>
        <el-tab-pane :label="TABS.OVERVIEW" :name="TABS.OVERVIEW">
          <overview-panel :zone="zone" @syncService="syncService" @update="updateZone">
          </overview-panel>
        </el-tab-pane>
      </el-tabs>
    </template>
    <!--dialog start-->
    <sync-service-dialog
      :zone="zone"
      :broker="selectedBroker"
      :visible="dialogConfigs.syncService.visible"
      :type="syncType"
      :isSyncing="isSyncing"
      @close="syncComplete"
      @error="syncError"
    >
    </sync-service-dialog>
    <!--dialog end-->
  </div>
    <div v-if="!showAdd">
      <newApp></newApp>
    </div>
  </div>
</template>

<script src="./zone-detail.js"></script>

