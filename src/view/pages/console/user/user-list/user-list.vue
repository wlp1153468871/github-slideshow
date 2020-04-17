<template>
  <div>
    <div class="layout-content-header">
      项目组管理
    </div>
    <div>
      <el-tabs v-model="activeName">
        <el-tab-pane v-if="SIDE_BAR.MEBMBER.canShow" :label="SIDE_BAR.MEBMBER.name" name="mebmber">
          <space-user-list :org-id="orgId" :space-id="spaceId"> </space-user-list>
        </el-tab-pane>
        <el-tab-pane v-if="SIDE_BAR.ZONE.canShow" :label="SIDE_BAR.ZONE.name" name="zone" lazy
          >可用区</el-tab-pane
        >
        <el-tab-pane
          v-if="SIDE_BAR.SERVE.canShow"
          :lazy="true"
          :label="SIDE_BAR.SERVE.name"
          name="serve"
          >服务</el-tab-pane
        >
        <el-tab-pane
          v-if="SIDE_BAR.APPROVE.canShow"
          :lazy="true"
          :label="SIDE_BAR.APPROVE.name"
          name="approve"
        >
          <approval-setting></approval-setting>
        </el-tab-pane>
        <el-tab-pane
          v-if="SIDE_BAR.ADVANCED_SETTING.canShow"
          :label="SIDE_BAR.ADVANCED_SETTING.name"
          name="setting"
          :lazy="true"
          >高级设置</el-tab-pane
        >
      </el-tabs>
      <!-- <div>
        <space-user-list
          :org-id="orgId"
          :space-id="spaceId">
        </space-user-list>
      </div> -->
    </div>
  </div>
</template>

<script src="./user-list.js"></script>
