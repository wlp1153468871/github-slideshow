<template>
  <div>
    <report-table
      :kindMap="deploymentConfig"
      placeholder="搜索Deployment Config名称"
      @search="searchDC"
      :loading="loading"
    >
      <template slot="title">
        <h3>Deployment Config</h3>
      </template>
    </report-table>
    <report-table
      :kindMap="deployment"
      placeholder="搜索Deployment名称"
      @search="searchD"
      :loading="loading"
    >
      <template slot="title">
        <h3>Deployment</h3>
      </template>
      <template slot="note">
        <p>cpu max 和 mem max 是最近七天的最大值</p>
      </template>
    </report-table>
  </div>
</template>
<script src="./reports.js"></script>
<style scoped lang="scss">
@import './reports.scss';
</style>
