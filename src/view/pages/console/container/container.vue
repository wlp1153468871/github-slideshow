<template>
  <div class="layout" :class="{ collapsed: isCollapse, hidden: !isSpaceView }">
    <!-- DX HEADER -->
    <dx-header :id-token="idToken" @logout="apLogout" v-if="idToken"></dx-header>
    <!-- ORIGIN -->
    <global-nav-bar v-else></global-nav-bar>
    <console-side-bar v-show="isSpaceView" @switch-section="switchSpace"> </console-side-bar>
    <template v-if="!isInitTenantView">
      <router-view class="layout-content"></router-view>
    </template>
    <circle-loading v-else position="space-view"></circle-loading>
  </div>
</template>

<script src="./container.js"></script>

<style lang="scss">
@import '~daoColor';

.application-list {
  z-index: 1;
  width: 150px;
  padding: 16px 0 16px 8px;
  color: #9ba3af;
  box-shadow: 1px 0 4px 0 rgba(214, 214, 214, 0.5);
  background: #fff;
}
</style>
