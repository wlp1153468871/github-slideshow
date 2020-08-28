// import store from '@/core/store';
import { mapState, mapGetters } from 'vuex';
import { first } from 'lodash';
import ManageMenus from '@/view/router/manage.js';

export default {
  name: 'ManageContainer',
  data() {
    return {
      ManageMenus,
    };
  },

  computed: {
    ...mapState(['isCollapse']),
    ...mapGetters(['pages']),

    showSideMenu() {
      return !this.$route.path.includes('/deploy/') && !this.$route.path.includes('/newapp/');
    },
  },
  mounted() {
    const ActiveMenuName = this.getActiveMenu(this.ManageMenus);
    this.$router.push({ name: first(ActiveMenuName) });
  },

  methods: {
    getActiveMenu(menus, result = []) {
      menus
        .filter(menu => !menu.meta.hidden)
        .forEach(menu => {
          if (this.pages.some(m => m === menu.meta.code)) {
            result.push(menu.name);
          }
          if (menu.children) {
            this.getActiveMenu(menu.children, result);
          }
        });
      return result;
    },
  },
};
