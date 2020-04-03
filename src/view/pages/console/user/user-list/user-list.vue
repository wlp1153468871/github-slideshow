<template>
  <div>
    <div class="layout-content-header">
      项目组管理
    </div>
    <div>
      <el-tabs v-model="activeName">
      <el-tab-pane :label="SIDE_BAR.MEBMBER" name="mebmber">
         <space-user-list
          :org-id="orgId"
          :space-id="spaceId">
        </space-user-list>
      </el-tab-pane>
      <el-tab-pane
        v-if="false"
        :label="SIDE_BAR.ZONE"
        name="zone"
        lazy>可用区</el-tab-pane>
      <el-tab-pane
        v-if="false"
        :lazy="true"
        :label="SIDE_BAR.SERVE"
        name="serve">服务</el-tab-pane>
      <el-tab-pane
        :lazy="true"
        :label="SIDE_BAR.APPROVE"
        name="approve">
        <approval-setting></approval-setting>
      </el-tab-pane>
      <el-tab-pane
        v-if="false"
        :label="SIDE_BAR.ADVANCED_SETTING"
        name="setting"
        :lazy="true">高级设置</el-tab-pane>
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
