import store from '@/core/store';
import { mapGetters, mapState } from 'vuex';
import OrgService from '@/core/services/org.service';
import SpaceService from '@/core/services/space.service';
import ZoneService from '@/core/services/zone.service';
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
  name: 'ConsoleContainer',

  beforeRouteUpdate(to, from, next) {
    const { spaceId, zoneId, orgId } = to.query;
    if (spaceId && zoneId && orgId) {
      SpaceService.setLocalSpace({
        id: spaceId,
      });
      ZoneService.setLocalZone({
        id: zoneId,
      });
      OrgService.setLocalOrg({
        id: orgId,
      });
      store.dispatch('initTenantView').finally(() => {
        next();
      });
    } else {
      next();
    }
  },

  data() {
    return {
      selectedSubMenu: null,
    };
  },

  // DX全局导航栏组件注册
  components: {
    DxHeader,
  },

  computed: {
    ...mapGetters(['zoneId', 'spaceDescription']),

    ...mapState(['isCollapse']),

    ...mapState({
      isInitTenantView: state => state.loadings.initTenantView,
    }),

    spaces() {
      return this.$store.getters.orgSpaces;
    },

    isSpaceView() {
      return (
        !this.$route.path.includes('/org') &&
        !this.$route.path.includes('/profile') &&
        !this.$route.path.includes('/console/deploy') &&
        !this.$route.path.includes('/audit') &&
        !this.$route.path.includes('/platform-approval') &&
        !this.$route.path.includes('/alarm/rule/create') &&
        !this.$route.path.includes('appstore/:appid/form/:version') &&
        !this.$route.path.includes('appstore/:appid/yamlform/:version') &&
        !this.$route.path.includes('appstore/app')
      );
    },

    idToken() {
      return AuthService.getIdToken();
    },
  },

  methods: {
    switchSpace(space) {
      this.$store.dispatch('switchSpace', { space });
      this.$tada(`切换${this.spaceDescription}到 ${space.name}`, {
        buttons: false,
        timer: 2000,
      });
    },
    apLogout() {
      this.$store.dispatch('logout').then(() => {
        StorageCache.clear();
        this.$router.push({
          name: 'login',
        });
      });
    },
  },
};
