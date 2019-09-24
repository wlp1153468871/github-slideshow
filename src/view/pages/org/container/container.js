import { mapState, mapGetters } from 'vuex';

export default {
  name: 'TenantContainer',

  data() {
    return {
      TABS: {
        TEAMS: { canShow: true, name: '项目组', to: { name: 'org.space' } },
        USERS: { canShow: true, name: '用户', to: { name: 'org.user' } },
        QUOTA: {
          canShow: false,
          name: '配额管理',
          to: { name: 'org.quota' },
        },
        QUOTA_REQUEST: {
          canShow: false,
          name: '配额更新请求',
          to: { name: 'org.quota-approval' },
        },
        // REGISTRY: { canShow: true, name: '镜像仓库信息', to: { name: 'org.registry' } },
      },
    };
  },

  computed: {
    ...mapState(['org']),
    ...mapGetters(['isOrganizationAdmin']),
  },

  created() {
    this.TABS.QUOTA.canShow = this.isOrganizationAdmin;
    this.TABS.QUOTA_REQUEST.canShow = this.isOrganizationAdmin;
  },
};
