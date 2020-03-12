<template>
  <div>
    <div class="layout-content-header">
      项目组管理
    </div>
    <div>
      <div>
        <space-user-list
          :org-id="orgId"
          :space-id="spaceId">
        </space-user-list>
      </div>
    </div>
  </div>
</template>

<script src="./user-list.js"></script>
