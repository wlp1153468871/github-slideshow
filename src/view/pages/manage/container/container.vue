<template>
  <div class="layout" :class="{ collapsed: isCollapse, hidden: !showSideMenu }">
    <global-nav-bar></global-nav-bar>
    <manage-side-bar v-if="showSideMenu"></manage-side-bar>
    <router-view class="layout-content"></router-view>
  </div>
</template>

<script src="./container.js"></script>
