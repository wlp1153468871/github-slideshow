import CatalogService from '@/core/services/catalog.service';
import SyncServiceDialog from '@/view/pages/dialogs/zone/sync-service';
// panels
import ManagePanel from './panels/manage';
import OverviewPanel from './panels/overview';

export default {
  name: 'ZoneDetail',
  components: {
    ManagePanel,
    OverviewPanel,
    SyncServiceDialog,
  },
  created() {
    this.loadCatalog();
  },
  data() {
    const zoneId = this.$route.params.zone; // 可用区ID
    const TABS = {
      BINDS: '服务管理',
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
      currentTab: TABS.BINDS,
      loading: true,
    };
  },
  methods: {
    loadCatalog() {
      this.loading = true;
      CatalogService.getCatalog(this.zone.id)
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
