import store from '@/core/store';

export default {
  name: 'ManageContainer',

  beforeRouteEnter(to, from, next) {
    store.dispatch('initManageView');
    next();
  },

  computed: {
    showSideMenu() {
      return !this.$route.path.includes('/deploy/');
    },
  },
};
