<template>
  <div></div>
</template>
<script >
import Vue from 'vue';
import store from '@/core/store';

export default {
  name: 'gateway',
  mounted() {
    if (store.getters.menus.some(m => m === 'overview')) {
      this.$router.push({ name: 'console.dashboard' });
    } else if (store.getters.menus.some(m => m === 'organization.space')) {
      this.$router.push({ name: 'console.space-settings' });
    } else {
      Vue.noty.error('您暂未加入任何项目组');
      this.$router.push({ name: 'console.profile' });
    }
  },
};
</script>
