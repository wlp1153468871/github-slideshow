<template>
  <div>
    <div class="layout-content-header bg-white">
      <breadcrumb
        :links="[
          { text: '租户列表', route: { name: 'manage.org.list' } },
          { text: org.name, route: { name: 'manage.org.detail' } },
          { text: space.name },
        ]"
      >
      </breadcrumb>
    </div>

    <el-tabs v-model="activeTab">
      <el-tab-pane :label="SIDE_BAR.USER" :name="SIDE_BAR.USER">
        <user-panel :space-id="spaceId" :org-id="orgId"> </user-panel>
      </el-tab-pane>

      <el-tab-pane :label="SIDE_BAR.SERVICE" :name="SIDE_BAR.SERVICE" lazy>
        <service-panel :space-id="spaceId" :org-id="orgId"> </service-panel>
      </el-tab-pane>

      <el-tab-pane :label="SIDE_BAR.ZONE" :name="SIDE_BAR.ZONE" lazy>
        <zone-panel :space-id="spaceId"> </zone-panel>
      </el-tab-pane>

      <el-tab-pane :label="SIDE_BAR.LIST" :name="SIDE_BAR.LIST">
        <LIST :spaceId="spaceId" :orgId="orgId"></LIST>
      </el-tab-pane>

      <el-tab-pane :label="SIDE_BAR.OVERVIEW" :name="SIDE_BAR.OVERVIEW">
        <overview-panel :org-id="orgId" :space="space" :space-id="spaceId" @save="updateSpace">
        </overview-panel>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script src="./space-detail.js"></script>
