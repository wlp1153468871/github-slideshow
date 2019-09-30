import store from '@/core/store';
import { mapGetters, mapState } from 'vuex';
import OrgService from '@/core/services/org.service';
import SpaceService from '@/core/services/space.service';
import ZoneService from '@/core/services/zone.service';

export default {
  name: 'ConsoleContainer',

  beforeRouteEnter(to, from, next) {
    // 首次进入租户视图，如果路由query中有租户，项目组，可用区ID，则进行切换
    const {
      spaceId,
      zoneId,
      orgId,
    } = to.query;
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
    }
    if (to.query.onInitTenantView) {
      next();
    } else {
      store.dispatch('initTenantView').finally(() => {
        next();
      });
    }
  },

  beforeRouteUpdate(to, from, next) {
    const {
      spaceId,
      zoneId,
      orgId,
    } = to.query;
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
        !this.$route.path.includes('/alarm/rule/create')
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
