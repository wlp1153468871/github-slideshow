import table from '@/view/mixins/table';
import OrgService from '@/core/services/org.service';
import ServiceService from '@/core/services/service.service';
// panels
import OverviewPanel from './panels/overview';
import SpacePanel from './panels/space';
import QuotaRequestPanel from './panels/quota-request';
import QuotaPanel from './panels/quota';
import OrgQuotaPanel from './panels/org-quota';
import OrgQuotaApprovalPanel from './panels/org-quota-approval';
import UserPanel from './panels/user';
import RegistryPanel from './panels/registry';
import ZonePanel from './panels/zone';

export default {
  name: 'OrgDetail',

  extends: table('id', 10, 'updated_at'),

  components: {
    OverviewPanel,
    SpacePanel,
    QuotaRequestPanel,
    QuotaPanel,
    UserPanel,
    RegistryPanel,
    ZonePanel,
    OrgQuotaPanel,
    OrgQuotaApprovalPanel,
  },

  created() {
    this.loadOrg();
    // this.loadUsersByOrgId();
  },

  data() {
    const SIDE_BAR = {
      OVERVIEW: '设置',
      USER: '用户列表',
      TEAM: '项目组',
      QUOTA: '配额管理',
      QUOTA_APPROVAL: '配额更新请求',
      QUOTA_GROUP: '配额组',
      REGISTRY: '镜像仓库信息',
      QUOTA_REQUEST: '配额审批',
      ZONE: '可用区',
    };
    const orgId = this.$route.params.org;
    const { tab = SIDE_BAR.OVERVIEW } = this.$route.query;
    return {
      tab,
      SIDE_BAR,
      // 通过详情 Route 获取当前租户id
      orgId,
      org: {}, // current org
      users: [],
      services: {
        all: [], // all services
        org: [], // org services
      },
      loadings: {
        all: false,
        addService: false,
      },
    };
  },

  methods: {
    switchTab(tab) {
      if (tab) {
        this.tab = tab;
      }
    },

    loadOrg() {
      this.loadings.addService = true;
      OrgService.getOrg(this.orgId)
        .then(org => {
          this.org = org;
        })
        .finally(() => {
          this.loadings.addService = false;
        });
    },

    loadUsersByOrgId() {
      this.loadings.all = true;
      OrgService.getMembers(this.orgId).then(users => {
        this.users = users;
      });
    },

    loadServices() {
      ServiceService.getAvailableServices().then(services => {
        this.services.all = services;
      });
    },

    loadServicesByOrgId() {
      ServiceService.getServiceDetailsByOrgId(this.orgId).then((services = []) => {
        this.services.org = services;
      });
    },

    updateOrg(org) {
      this.org = org;
    },

    removeServiceFromOrg(serviceId) {
      ServiceService.removeServiceFromOrg(this.orgId, serviceId).then(() => {
        const index = this.services.org.findIndex(v => v.id === serviceId);
        this.services.org.splice(index, 1);
        this.$noty.success('移除服务成功');
      });
    },

    updateServiceFromOrg(request) {
      const orgId = this.org.id;
      Promise.all(
        request.map(quota => {
          const { quotaUnitId, limit } = quota;
          return OrgService.updateOrgQuota(orgId, quotaUnitId, { limit });
        }),
      ).then(() => {
        this.$noty.success('保存配额成功');
      });
    },

    deleteOrg() {
      OrgService.deleteOrg(this.orgId).then(() => {
        this.$noty.success('删除租户成功');
        this.$router.push({
          name: 'manage.org.list',
        });
      });
    },

    addOrgService(service) {
      ServiceService.updateOrgService(this.orgId, service.id).then(() => {
        this.services.org.push(service);
        this.$noty.success('添加服务成功');
      });
    },
  },
};
