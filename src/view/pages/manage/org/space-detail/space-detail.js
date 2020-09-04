import SpaceService from '@/core/services/space.service';
import OrgService from '@/core/services/org.service';
// panels
import OverviewPanel from './panels/overview';
import QuotaPanel from './panels/quota';
import QuotaRequestPanel from './panels/quota-request';
import ServicePanel from './panels/service';
import SettingPanel from './panels/setting';
import UserPanel from './panels/user';
import ZonePanel from './panels/zone';
import LIST from './panels/applist';

export default {
  name: 'SpaceDetail',

  components: {
    OverviewPanel,
    QuotaPanel,
    QuotaRequestPanel,
    ServicePanel,
    SettingPanel,
    UserPanel,
    ZonePanel,
    LIST,
  },

  created() {
    const { org, space } = this.$route.params;
    this.spaceId = space;
    this.orgId = org;
    this.loadSpace();
    this.loadOrg();
  },

  data() {
    const SIDE_BAR = {
      OVERVIEW: '设置',
      LIST: '可用chart模板',
      USER: '用户列表',
      ZONE: '可用区',
      SERVICE: '可用服务',
      // QUOTA: '项目配额',
      // QUOTA_REQUEST: '配额请求',
    };

    return {
      SIDE_BAR,
      activeTab: SIDE_BAR.USER,
      spaceId: '',
      orgId: '',
      space: { name: '' },
      org: { name: '' },
      loadings: {
        all: false,
        space: false,
        addService: false,
      },
    };
  },

  methods: {
    loadSpace() {
      SpaceService.getSpace(this.spaceId).then(space => {
        this.space = space;
      });
    },

    loadOrg() {
      return OrgService.getOrg(this.orgId).then(org => {
        this.org = org;
      });
    },

    updateSpace(space) {
      this.space = space;
    },

    refreshSpaceQuotaGroups() {
      if (this.$refs.qutoaPanel) {
        this.$refs.qutoaPanel.loadSpaceUsedQuotaGroups();
      }
    },
  },
};
