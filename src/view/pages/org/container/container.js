import { mapState, mapGetters } from 'vuex';
import { first } from 'lodash';

export default {
  name: 'TenantContainer',

  data() {
    return {
      TABS: {
        TEAMS: {
          canShow: this.$can('organization.space'),
          name: '项目组',
          to: { name: 'org.space' },
        },
        USERS: { canShow: this.$can('organization.user'), name: '用户', to: { name: 'org.user' } },
        QUOTA: {
          canShow: this.$can('organization.quota'),
          name: '配额管理',
          to: { name: 'org.quota' },
        },
        QUOTA_REQUEST: {
          canShow: this.$can('organization.approval'),
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

  mounted() {
    // this.mounted;
    const activeTab = Object.values(this.TABS).filter(tab => tab.canShow);
    if (activeTab.length) {
      const { to } = first(activeTab);
      this.$router.push({ name: to.name });
    } else {
      this.$noty.error('您暂无租户权限');
    }
    // this.TABS.QUOTA.canShow = this.isOrganizationAdmin;
    // this.TABS.QUOTA_REQUEST.canShow = this.isOrganizationAdmin;
  },
};
