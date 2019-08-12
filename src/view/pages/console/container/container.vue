<template>
  <div class="layout">
    <global-nav-bar></global-nav-bar>
    <div class="layout-content">
      <console-side-bar
        v-show="isSpaceView"
        @switch-section="switchSpace">
      </console-side-bar>
      <div class="layout-content" v-if="!isInitTenantView">
        <div class="content-wrapper">
          <router-view class="content" :key="$route.fullPath"></router-view>
        </div>
      </div>
    </div>
    <div class="loading-mask" v-if="isInitTenantView">
      <div class="loading-container">
        <loading-two-point></loading-two-point>
      </div>
    </div>
  </div>
</template>

<script src="./container.js"></script>

<style lang="scss">
@import '~daoColor';
@import './container.scss';

.application-list {
  z-index: 1;
  width: 150px;
  padding: 16px 0 16px 8px;
  color: #9ba3af;
  box-shadow: 1px 0 4px 0 rgba(214, 214, 214, 0.5);
  background: #fff;
}
</style>
