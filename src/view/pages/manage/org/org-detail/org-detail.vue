<template>
  <div>
    <div class="layout-content-header bg-white">
      <breadcrumb
        :links="[{ text: '租户列表', route: { name: 'manage.org.list' } }, { text: org.name }]"
      >
      </breadcrumb>
    </div>

    <el-tabs v-model="tab">
      <el-tab-pane :label="SIDE_BAR.TEAM" :name="SIDE_BAR.TEAM">
        <space-panel :org-id="orgId"> </space-panel>
      </el-tab-pane>
      <el-tab-pane :label="SIDE_BAR.USER" :name="SIDE_BAR.USER">
        <user-panel
          :users="users"
          :org-id="orgId"
          :canDelete="$can('platform.organization.user')"
          :canCreat="$can('platform.organization.user')"
          :canUpdate="$can('platform.organization.user')"
          :canView="$can('platform.organization.user')"
        >
        </user-panel>
      </el-tab-pane>
      <el-tab-pane :label="SIDE_BAR.QUOTA" :name="SIDE_BAR.QUOTA">
        <org-quota-panel :tab="tab" :defautlTab="SIDE_BAR.QUOTA"> </org-quota-panel>
      </el-tab-pane>
      <el-tab-pane :label="SIDE_BAR.QUOTA_APPROVAL" :name="SIDE_BAR.QUOTA_APPROVAL">
        <org-quota-approval-panel
          :tab="tab"
          :defautlTab="SIDE_BAR.QUOTA_APPROVAL"
          :quota-usages="org.quota_usages"
        >
        </org-quota-approval-panel>
      </el-tab-pane>
      <el-tab-pane :label="SIDE_BAR.ZONE" :name="SIDE_BAR.ZONE">
        <zone-panel :org-id="orgId"> </zone-panel>
      </el-tab-pane>
      <el-tab-pane :label="SIDE_BAR.REGISTRY" :name="SIDE_BAR.REGISTRY" :lazy="true">
        <registry-panel :org-id="orgId"></registry-panel>
      </el-tab-pane>
      <el-tab-pane :label="SIDE_BAR.OVERVIEW" :name="SIDE_BAR.OVERVIEW">
        <overview-panel :org-id="orgId" :org="org" :users="users" @save="updateOrg">
        </overview-panel>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script src="./org-detail.js"></script>
