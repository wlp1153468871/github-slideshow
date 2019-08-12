<template>
  <div class="layout">
    <global-nav-bar></global-nav-bar>
    <div class="layout-content">
      <manage-side-bar v-if="showSideMenu"></manage-side-bar>
      <div class="content-wrapper">
        <router-view class="content"></router-view>
      </div>
    </div>
  </div>
</template>

<script src="./container.js">
</script>
