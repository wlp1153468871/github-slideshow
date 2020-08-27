import CatalogService from '@/core/services/catalog.service';
import SyncServiceDialog from '@/view/pages/dialogs/zone/sync-service';
// panels
import ManagePanel from './panels/manage';
import OverviewPanel from './panels/overview';
import AppList from './panels/app-list';
import newApp from './panels/new-app';
import ChartList from './panels/chart-list';

export default {
  name: 'ZoneDetail',
  components: {
    ManagePanel,
    OverviewPanel,
    SyncServiceDialog,
    AppList,
    newApp,
    ChartList,
  },
  created() {
    this.loadCatalog();
  },
  data() {
    const zoneId = this.$route.params.zone; // 可用区ID
    const TABS = {
      BINDS: '服务管理',
      APPLICATION: '应用列表',
      CHART: 'chart管理',
      OVERVIEW: '设置',
    };
    return {
      TABS,
      zone: {
        id: zoneId,
        name: '...',
        brokers: [],
      },
      dialogConfigs: {
        syncService: { visible: false },
      },
      syncType: 'catalog',
      isSyncing: false,
      selectedBroker: null,
      currentTab: TABS.APPLICATION,
      loading: true,
      showAdd: true, // 是否是新增应用页面
    };
  },
  methods: {
    /**
     * 新增应用点击的自定义事件
     */
    addApplication() {
      this.showAdd = true;
    },
    loadCatalog() {
      this.loading = true;
      const AuthorizationScope = JSON.stringify({
        platform_id: 'dsp',
        zone_id: this.zone.id,
      });
      const config = {
        headers: {
          AuthorizationScope,
        },
      };
      CatalogService.getCatalog(this.zone.id, config)
        .then(data => {
          this.zone = data;
          if (this.selectedBroker) {
            this.selectedBroker = this.zone.brokers[
              this.zone.brokers.findIndex(broker => broker.id === this.selectedBroker.id)
            ];
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // 同步可用区下的broker以及service
    syncService(type, isSyncing) {
      this.syncType = type;
      this.isSyncing = isSyncing;
      this.dialogConfigs.syncService.visible = true;
    },

    syncComplete() {
      this.currentTab = this.TABS.BINDS;
      this.dialogConfigs.syncService.visible = false;
      this.loadCatalog();
    },

    syncError() {
      this.dialogConfigs.syncService.visible = false;
    },

    updateZone(zone) {
      this.zone = zone;
    },
  },
};
