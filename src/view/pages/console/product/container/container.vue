<template>
  <div class="product-container">
    <global-nav-bar v-if="isCheckoutPage" style="position: fixed;"> </global-nav-bar>
    <common-status-bar v-else :inverse="true"> </common-status-bar>
    <router-view class="app-content app-wrap"> </router-view>
  </div>
</template>

<script src="./container.js"></script>

<style lang="scss">
.product-container {
  height: 100%;
}
.app-wrap {
  min-height: 100%;
  padding-top: 64px;
  overflow: auto;
}
</style>
