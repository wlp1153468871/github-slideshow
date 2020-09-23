import OrgService from '@/core/services/org.service';
import AddOrgDialog from '@/view/pages/dialogs/org/add-org';

export default {
  name: 'OrgList',
  components: {
    AddOrgDialog,
  },
  created() {
    if (this.$can('platform.organization.get')) {
      this.loadOrgs();
    } else {
      this.$noty.error('您暂无组织管理查看权限');
    }
  },
  data() {
    return {
      rows: [],
      // 正在加载
      loadings: {
        orgs: false,
      },
      dialogConfigs: {
        addOrg: { visible: false },
      },
      filterMethod: this.filterOrgs,
      total: 0,
    };
  },
  watch: {
    zoneId() {
      this.loadOrgs();
    },
  },
  methods: {
    loadOrgs(page, pageSize, q) {
      this.loadings.orgs = true;
      OrgService.getOrgs(page, pageSize, q)
        .then(orgs => {
          this.rows = orgs.data;
          this.total = orgs.total;
        })
        .finally(() => {
          this.loadings.orgs = false;
        });
    },
    filterOrgs(filterKey, pageSize) {
      this.loadOrgs(1, pageSize, filterKey);
    },
    switchPage(page, pageSize, filterKey) {
      this.loadOrgs(page, pageSize, filterKey);
    },
    addOrgDialog() {
      this.dialogConfigs.addOrg.visible = true;
    },

    createOrg(org) {
      OrgService.addOrg(org).then(() => {
        this.loadOrgs();
        this.$noty.success('添加租户成功');
      });
    },
  },
};
