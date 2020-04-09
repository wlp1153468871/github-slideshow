<template>
  <div class="gateway">
    <exception-page type="40301" ></exception-page>
  </div>
</template>
<script >
import Vue from 'vue';
import store from '@/core/store';
import ExceptionPage from '@/view/pages/exception/ExceptionPage.vue';

export default {
  name: 'gateway',
  components: {
    ExceptionPage,
  },
  mounted() {
    if (store.getters.menus.some(m => m === 'overview')) {
      this.$router.push({ name: 'console.dashboard' });
    } else if (store.getters.menus.some(m => m === 'organization.space')) {
      this.$router.push({ name: 'console.space-settings' });
    } else {
      Vue.noty.error('您暂未加入任何项目组');
      // this.$router.push({ name: 'console.profile' });
    }
  },
};
</script>

<style lang="scss">
.gateway {
  padding: 20px 0 0 20px;
  
}
</style>
