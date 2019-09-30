import store from '@/core/store';
import { mapState } from 'vuex';

export default {
  name: 'ManageContainer',

  beforeRouteEnter(to, from, next) {
    store.dispatch('initView');
    next();
  },

  computed: {
    ...mapState(['isCollapse']),

    showSideMenu() {
      return !this.$route.path.includes('/deploy/');
    },
  },
};
