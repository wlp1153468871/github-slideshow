<template>
  <div class="gateway">
    <exception-page type="40301"></exception-page>
  </div>
</template>
<script>
import Vue from 'vue';
import store from '@/core/store';
import { mapGetters } from 'vuex';

import ExceptionPage from '@/view/pages/exception/ExceptionPage.vue';

export default {
  name: 'gateway',
  components: {
    ExceptionPage,
  },
  computed: {
    ...mapGetters(['pages']),
  },
  mounted() {
    this.gotoNextPage();
  },

  methods: {
    gotoNextPage() {
      if (store.getters.pages.some(m => m === 'space.overview')) {
        this.$router.push({ name: 'console.dashboard' });
      } else if (store.getters.pages.some(m => m === 'organization.space')) {
        this.$router.push({ name: 'console.space-settings' });
      } else {
        Vue.noty.error('您暂未加入任何项目组');
        // this.$router.push({ name: 'console.profile' });
      }
    },
  },

  watch: {
    pages() {
      this.gotoNextPage();
    },
  },
};
</script>

<style lang="scss">
.gateway {
  padding: 20px 0 0 20px;
}
</style>
