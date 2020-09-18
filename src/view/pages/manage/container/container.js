// import store from '@/core/store';
import { mapState, mapGetters } from 'vuex';
import { first } from 'lodash';
import ManageMenus from '@/view/router/manage.js';
import AuthService from '@/core/services/auth.service';


let DxHeader = {};

if (window.DxHeader) {
  ({ DxHeader } = window.DxHeader);
} else {
  console.log('DxHeader init……');
  const headerScript = document.getElementById('__DX_HEADER__');
  DxHeader = () => new Promise((resolve, rehect) => {
    // 处理在执行过程中已经加载好的情况
    if (window.DxHeader) {
      console.log('dx0:', '已加载完成');
      resolve(window.DxHeader.DxHeader);
      return;
    }
    headerScript.onload = () => {
      console.log('dx1:', '加载太慢了');
      resolve(window.DxHeader.DxHeader);
    };
    headerScript.onerror = () => {
      console.log('dx2:', '加载出错');
      rehect(window.DxHeader.DxHeader);
    };
  });
}

export default {
  name: 'ManageContainer',
  data() {
    return {
      ManageMenus,
    };
  },

  // DX全局导航栏组件注册
  components: {
    DxHeader,
  },

  computed: {
    ...mapState(['isCollapse']),
    ...mapGetters(['pages']),

    showSideMenu() {
      return !this.$route.path.includes('/deploy/') && !this.$route.path.includes('/newapp/');
    },

    idToken() {
      return AuthService.getIdToken();
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
    apLogout() {
      this.$store.dispatch('logout').then(() => {
        console.log(1111);
        this.$router.push({
          name: 'login',
        });
        // StorageCache.clear();
      });
    },
  },
};
