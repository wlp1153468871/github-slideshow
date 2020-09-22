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
      filterMethod: (data, filterKey) =>
        data.name.toLowerCase().includes(filterKey) ||
        data.short_name.toLowerCase().includes(filterKey),
    };
  },
  watch: {
    zoneId() {
      this.loadOrgs();
    },
  },
  methods: {
    loadOrgs() {
      this.loadings.orgs = true;
      OrgService.getOrgs()
        .then(orgs => {
          this.rows = orgs.data;
        })
        .finally(() => {
          this.loadings.orgs = false;
        });
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
