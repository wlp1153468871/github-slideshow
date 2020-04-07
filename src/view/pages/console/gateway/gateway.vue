<template>
  <div></div>
</template>
<script >
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
      next('console.profile');
    }
    NProgress.done();
  },
};
</script>
