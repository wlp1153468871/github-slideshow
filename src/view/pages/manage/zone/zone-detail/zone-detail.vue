<template>
  <div>
  <div class="page-manage" v-if="showAdd">
    <circle-loading v-if="loading"></circle-loading>
    <template v-else>
<!--      <div class="layout-content-header bg-white" style="color: #000000">-->
<!--        <breadcrumb-->
<!--          :links="[-->
<!--            { text: '可用区管理', route: { name: 'manage.zone.list' } },-->
<!--            { text: zone.name },-->
<!--          ]"-->
<!--        >-->
<!--        </breadcrumb>-->
      <div class="break-navBar">
        <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'manage.zone.list' }">可用区管理</el-breadcrumb-item>
          <el-breadcrumb-item>可用区详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-tabs v-model="currentTab" class="zone-tab">
        <el-tab-pane :label="TABS.APPLICATION" :name="TABS.APPLICATION">
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
<style lang="scss">
  .page-manage {
    .breadcrumb {
      .el-breadcrumb__inner .is-link{
        font-weight: normal;
      }
    }
  }
</style>
<style lang="scss" scoped>
  .page-manage {
    .break-navBar {
      height: 32px;
      line-height: 32px;
      font-size: 14px;
    }
    .breadcrumb {
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      margin-left: 20px;
      color: #595F69;
    }
  }
</style>

