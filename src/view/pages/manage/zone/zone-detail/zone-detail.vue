<template>
  <div>
  <div class="page-manage" v-if="showAdd">
    <circle-loading v-if="loading"></circle-loading>
    <template v-else>
      <div class="break-navBar">
        <breadcrumb
          :links="[
            { text: '可用区管理 ', route: {  name: 'manage.zone.list' } },
            { text: '可用区详情' },
          ]"
        >
        </breadcrumb>
      </div>

      <el-tabs v-model="currentTab" class="zone-tab">
        <el-tab-pane
          :label="TABS.APPLICATION"
          :name="TABS.APPLICATION"
          v-if="$can('platform.zone.applications.view')"
        >
          <AppList :id="zone.id" @addApplication="addApplication"></AppList>
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
         <el-tab-pane :label="TABS.NODE" :name="TABS.NODE">
          <node-panel :hideZoneSelect="'true'" :zone='zone'></node-panel>
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
<style lang="scss" scoped>
  .page-manage {
    .break-navBar {
      background: #D5DBE3;
      padding-left: 10px;
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      font-family: SFProText-Regular,SFProText;
      font-weight: 400;
      color: #595F69;
      border-bottom: 1px solid #D5DBE3;
    }
    /* .breadcrumb {
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      margin-left: 20px;
      color: #595F69;
    } */
  }
</style>

