import tableView from '@/view/mixins/table-view';
import OrgService from '@/core/services/org.service';

export default {
  name: 'OrgList',
  extends: tableView('id', 10, 'name'),
  created() {
    this.initTable();
    this.loadOrgs();
  },
  data() {
    return {
      rows: [],
      // 正在加载
      loadings: {
        orgs: false,
      },
    };
  },
  watch: {
    zoneId() {
      this.loadOrgs();
    },
  },
  methods: {
    initTable() {
      this.setTableProps([
        {
          id: 'name',
          name: '租户名',
          type: 'goto',
          other: {
            onClick: org => {
              this.$router.push({
                name: 'manage.quota.space-group-detail',
                params: { org: org.id },
              });
            },
          },
        },
        { id: 'short_name', name: '唯一标识' },
        { id: 'description', name: '备注', filter: 'otherwise' },
      ]);
    },

    loadOrgs() {
      this.loadings.orgs = true;
      OrgService.getOrgs()
        .then(orgs => {
          this.rows = orgs;
        })
        .finally(() => {
          this.loadings.orgs = false;
        });
    },
  },
};
