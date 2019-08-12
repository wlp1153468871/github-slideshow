import store from '@/core/store';
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'ConsoleContainer',

  beforeRouteEnter(to, from, next) {
    store.dispatch('initTenantView');
    next();
  },

  data() {
    return {
      selectedSubMenu: null,
    };
  },

  computed: {
    ...mapGetters(['zoneId']),

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
        !this.$route.path.includes('/deploy/')
      );
    },
  },

  methods: {
    switchSpace(space) {
      this.$store.dispatch('switchSpace', { space });
      this.$tada(`切换项目组到 ${space.name}`, {
        buttons: false,
        timer: 2000,
      });
      this.$router.push({
        name: 'console.dashboard',
      });
    },
  },
};
