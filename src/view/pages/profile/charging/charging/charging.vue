<template>
  <div>
    <div class="layout-content-header bg-white">
      <breadcrumb
        :links="[
          { text: '订单管理' },
      ]">
      </breadcrumb>
    </div>
    <dao-tab class="dao-header-tab-nav">
      <dao-tab-item :heading="TABS.ORDER_LIST">
        <order-list-panel>
        </order-list-panel>
      </dao-tab-item>
    </dao-tab>
  </div>
</template>

<script src="./charging.js"></script>
