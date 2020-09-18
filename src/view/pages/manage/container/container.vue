<template>
  <div class="layout" :class="{ collapsed: isCollapse, hidden: !showSideMenu }">
    <!-- DX HEADER -->
    <dx-header :id-token="idToken" @logout="apLogout" v-if="idToken"></dx-header>
    <!-- ORIGIN -->
    <global-nav-bar v-else></global-nav-bar>
    <!-- <global-nav-bar></global-nav-bar> -->
    <manage-side-bar v-if="showSideMenu"></manage-side-bar>
    <router-view class="layout-content"></router-view>
  </div>
</template>

<script src="./container.js"></script>
