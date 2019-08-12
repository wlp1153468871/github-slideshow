<template>
  <div>
    <circle-loading v-if="loadings.page"></circle-loading>
    <div
      class="page-deployment-list"
      v-else>
      <resource-header :resource="resource"></resource-header>
      <div class="dao-view-main">
        <div class="dao-view-content">
          <deployment-config-list
            :deploymentConfigs="deploymentConfigs"
            :loading="loadings.deploymentConfigTable"
            @refresh="getDeploymentConfig">
          </deployment-config-list>
          <deployments-list
            :deployments="deployments"
            :loading="loadings.deploymentsTable"
            @refresh="getDeployments">
          </deployments-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./_deployments.js">
</script>

<style lang="scss" src="./_deployments.scss">
</style>
