<template>
  <div id="alarm-metric-list">
    <div class="layout-content-header">
      告警指标
      <span class="header-note">告警指标为配置文件创建，如需更改，请查看部署文档相关内容</span>
    </div>
    <el-tabs>
      <el-tab-pane label="容器">
        <metric-table :rules="containerMetrics" :loading="loading"></metric-table>
      </el-tab-pane>
      <el-tab-pane lazy label="应用">
        <metric-table :rules="appMetrics" :loading="loading"></metric-table>
      </el-tab-pane>
      <el-tab-pane lazy label="服务">
        <metric-table :rules="serviceMetrics" :loading="loading">
          <template #filter>
            <label for="" class="label-input">类型</label>
            <el-select
              filterable
              size="small"
              v-model="currentMetricName"
              :disabled="!serviceMetricsNames.length"
              placeholder="请选择"
            >
              <el-option
                :value="s"
                :label="s"
                v-for="s in serviceMetricsNames"
                :key="s"
              ></el-option>
            </el-select>
          </template>
        </metric-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script src="./alarm-metrics.js"></script>
<style lang="scss">
@import './alarm-metrics';
</style>
