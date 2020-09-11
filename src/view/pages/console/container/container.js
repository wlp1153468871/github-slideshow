import store from '@/core/store';
import { mapGetters, mapState } from 'vuex';
import OrgService from '@/core/services/org.service';
import SpaceService from '@/core/services/space.service';
import ZoneService from '@/core/services/zone.service';

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
      idToken: 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJIaHB2T3hZS29MeTdobFlwbHc5TUZlaGxSejhSOVgzWkVEYnhETFZrSWxJIn0.eyJleHAiOjE1OTk4ODA5MTEsImlhdCI6MTU5OTc5NDUxMiwiYXV0aF90aW1lIjoxNTk5Nzk0NTExLCJqdGkiOiJiMDRhYzQwOS1kYzZmLTQyY2MtYWMzNS1jNjI4Zjg2MjZhNTEiLCJpc3MiOiJodHRwOi8vMTAuMjAuMjA0LjUzOjMwMDMzL2FwaS92MS9yZWFsbXMvZHgtYXJjaCIsImF1ZCI6ImR4LWFyY2giLCJzdWIiOiJlNTg3NDkwMy1iOWRjLTQ4NzYtYmU5Ny0wNjVmODFhMjllYzYiLCJ0eXAiOiJJRCIsImF6cCI6ImR4LWFyY2giLCJzZXNzaW9uX3N0YXRlIjoiYTJlYWU2NGYtNzFmNi00MWIwLTliOTQtZjMzYTY1NWRiNzg0IiwiYWNyIjoiMSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicHJlZmVycmVkX3VzZXJuYW1lIjoiYWRtaW4iLCJnaXZlbl9uYW1lIjoiIiwiZmFtaWx5X25hbWUiOiIifQ.l1RSX7qPnhoAoae2wliqCMKYbWHUSOeJZouPN82t2ciClkBZQbtgW_MEi53PWeHpvaschQEfdVoRkTbusOY9HlF-FakEb2BJcFRng4plC4N8-KoKbOOc0OCZp0RFASC6FB7UfuCXLnHKj4mPDxmFlLtM7dbTBgHfkTkqpcYa0pJoj7taISyHdzJmLIS2WvaVY730TEd6sc51LaV8clhIVWVsw-3Z0XN9im41_IPEHsd-hpcY6-sEfFXbabQb7Sd-8xLH6-xM6okP5wj9kmgpFmkpgSGBiRIOcPKwTxnJnj7rw8e3PW37XvQzjlOfyfsQy1hFnHwGHM2WsqyN-7uzUw',
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
  },

  methods: {
    switchSpace(space) {
      this.$store.dispatch('switchSpace', { space });
      this.$tada(`切换${this.spaceDescription}到 ${space.name}`, {
        buttons: false,
        timer: 2000,
      });
    },
  },
};
