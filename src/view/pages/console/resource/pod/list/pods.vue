<template>
  <div class="page-pods">
    <circle-loading v-if="loadings.page"></circle-loading>
    <template v-else>
      <resource-header :resource="resource"></resource-header>
      <div class="dao-view-main">
        <div class="dao-view-content">
          <pod-table
            :pods="pods"
            :loading="loadings.table"
            @refresh="getPods">
          </pod-table>
        </div>
      </div>
    </template>
  </div>
</template>

<script src="./_pods.js">
</script>

<style lang="scss" src="./_pods.scss">
</style>
