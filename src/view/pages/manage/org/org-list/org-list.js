
import tableView from '@/view/mixins/table-view';
import OrgService from '@/core/services/org.service';
import AddOrgDialog from '@/view/pages/dialogs/org/add-org';

export default {
  name: 'OrgList',
  extends: tableView('id', 10, 'name'),
  components: {
    AddOrgDialog,
  },
  created() {
    this.loadOrgs();
    const gotoOrg = org => {
      this.$router.push({
        name: 'manage.org.detail',
        params: { org: org.id },
      });
    };
    this.setTableProps([
      {
        id: 'name', name: '租户名', type: 'goto', other: { onClick: gotoOrg },
      },
      { id: 'short_name', name: '唯一标识' },
      { id: 'description', name: '备注', filter: 'otherwise' },
    ]);
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
        data.name.toLowerCase().includes(filterKey)
        || data.short_name.toLowerCase().includes(filterKey),
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
      OrgService.getOrgs().then(orgs => {
        this.rows = orgs;
      }).finally(() => {
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
