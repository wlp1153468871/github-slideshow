<template>
  <div class="gateway">
    <exception-page type="40301"></exception-page>
  </div>
</template>
<script>
import Vue from 'vue';
import store from '@/core/store';
import { mapGetters } from 'vuex';
import ConsoleMenus from '@/view/router/console.js';
import { first } from 'lodash';

import ExceptionPage from '@/view/pages/exception/ExceptionPage.vue';

export default {
  name: 'gateway',
  components: {
    ExceptionPage,
  },
  data() {
    return {
      ConsoleMenus,
    };
  },
  computed: {
    ...mapGetters(['pages']),
  },
  mounted() {
    this.gotoNextPage();
  },

  methods: {
    async gotoNextPage() {
      const activeMenu = await this.getActiveMenu(this.ConsoleMenus);
      // console.log({ activeMenu });
      if (activeMenu.length) {
        this.$router.push({ name: first(activeMenu) });
      } else if (store.getters.pages.some(m => m === 'organization.space')) {
        this.$router.push({ name: 'console.space-settings' });
      } else {
        Vue.noty.error('您暂未加入任何项目组');
        // this.$router.push({ name: 'console.profile' });
      }
    },
    getActiveMenu(menus, result = []) {
      // TODO:服务根据后端数据渲染 无服务id 无法跳转到服务页面
      menus
        .filter(menu => !menu.meta.hidden || menu.meta.isExempt)
        .forEach(menu => {
          const codes = menu.meta.code.split(';');
          if (this.pages.some(m => codes.some(c => c === m))) {
            result.push(menu.name);
          }
          if (menu.children) {
            this.getActiveMenu(menu.children, result);
          }
        });
      return result;
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
