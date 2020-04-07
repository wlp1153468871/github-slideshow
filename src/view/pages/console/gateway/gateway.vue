<template>
  <div></div>
</template>
<script >
import Vue from 'vue';
import store from '@/core/store';
import NProgress from 'nprogress';

export default {
  name: 'gateway',
  beforeRouteEnter(to, from, next) {
    if (store.getters.menus.some(m => m === 'overview')) {
      next({ name: 'console.dashboard' });
    } else if (store.getters.menus.some(m => m === 'organization.space')) {
      next({ name: 'console.space-settings' });
    } else {
      Vue.noty.error('您暂未加入任何项目组');
      next({ name: 'console.profile' });
    }
    NProgress.done();
  },
};
</script>
