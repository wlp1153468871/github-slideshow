<template>
  <div class="module-manage-service">
    <div class="layout-content-header">
      服务管理
    </div>
    <div class="dao-view-main ">
      <dao-table-view
        ref="tableView"
        :rows="rows"
        :config="tConfig"
        :loading="loadings.maps"
        @refresh="loadService">
      </dao-table-view>
    </div>
  </div>
</template>

<script src="./service-list.js">
</script>
