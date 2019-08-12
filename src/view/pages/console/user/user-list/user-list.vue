<template>
  <div>
    <div class="layout-content-header">
      用户管理
    </div>
    <div class="dao-view-main">
      <div class="dao-view-content">
        <space-user-list
          :org-id="orgId"
          :space-id="spaceId">
        </space-user-list>
      </div>
    </div>
  </div>
</template>

<script src="./user-list.js"></script>
