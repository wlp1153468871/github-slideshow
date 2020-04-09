<template>
  <div>
    <div class="layout-content-header">
      项目配额组设置
    </div>
    <div class="dao-view-main">
      <div class="dao-view-content">
        <!-- 用户列表 -->
        <dao-table-view :rows="rows" :config="tConfig" :loading="loadings.orgs" @refresh="loadOrgs">
        </dao-table-view>
      </div>
    </div>
  </div>
</template>

<script src="./space-quota-group.js"></script>
