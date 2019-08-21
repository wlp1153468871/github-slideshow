<template>
  <div>
    <circle-loading v-if="loadings.page"></circle-loading>
    <div
      class="page-deployment-list"
      v-else>
      <resource-header :resource="resource"></resource-header>
      <div class="dao-view-main">
        <div class="dao-view-content">
          <deployments-list
            :deployments="deployments"
            :loading="loadings.table"
            @refresh="getDeployments">
          </deployments-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./_deployments.js">
</script>
