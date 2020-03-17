<template>
  <div id="alarm-list">
    <circle-loading v-if="loadings.alarmListView"></circle-loading>
    <template v-else>
      <resource-header :resource="resource"></resource-header>
      <h2 v-if="!accessed" class="accessed-banned-tip">
        当前可用区未开启告警功能，如需使用，请联系超级管理员
      </h2>
      <div v-else>
        <el-tabs>
          <el-tab-pane
            label="容器"
          >
            <container
              :rules="containerRules"
              @updateRules="updateRules"
            ></container>
          </el-tab-pane>
          <el-tab-pane
            lazy
            label="应用"
          >
            <app
              :rules="appRules"
              @updateRules="updateRules"
            ></app>
          </el-tab-pane>
          <el-tab-pane
            lazy
            label="服务"
          >
            <service
              :rules="serviceRules"
              @updateRules="updateRules"
            ></service>
          </el-tab-pane>
        </el-tabs>
      </div>
    </template>
  </div>
</template>
<script src="./list.js"></script>
<style lang="scss">
  @import './list';
</style>
