import tableView from '@/view/mixins/table-view';
import ZoneService from '@/core/services/zone.service';

export default {
  name: 'ZoneList',

  extends: tableView('id', 10, 'name'),

  data() {
    return {
      rows: [],
      zones: [],
      zone: {},
      dialogConfigs: {
        editZone: { visible: false },
        updateZone: { visible: false },
        operationType: 'create',
      },
      loadings: {
        zone: false,
      },
      isCreating: false,
    };
  },

  created() {
    this.initTableView();
    this.loadZones();
  },

  methods: {
    initTableView() {
      const onClick = zone => {
        this.$router.push({
          name: 'manage.zone.detail',
          params: {
            zone: zone.id,
          },
        });
      };

      const renderStatus = status => {
        return status ? '显示' : '隐藏';
      };
      const getStatus = (_, item) => (!item.available ? 'STOPED' : 'SUCCESS');

      this.setTableProps([
        {
          id: 'name',
          name: '可用区',
          type: 'goto',
          other: { onClick },
        },
        {
          id: 'clusterUrl',
          name: '集群地址',
          type: 'goto',
          other: { onClick: this.openClusterUrl },
        },
        {
          id: 'es',
          name: 'ES 地址',
          filter: 'otherwise',
          value: 'es.esUrl',
        },
        {
          id: 'available',
          name: '状态',
          value: renderStatus,
          type: 'status',
          other: { status: getStatus },
        },
        { id: 'createdAt', name: '创建时间', filter: 'unix_date' },
      ]);
      const isEnable = item => item.available;
      const isDisable = item => !item.available;
      this.setTableOperations([
        { name: '基础设置', event: 'update-zone' },
        { name: '显示', event: 'confirm-enable', visible: isDisable },
        { name: '隐藏', event: 'confirm-disable', visible: isEnable },
      ]);
    },

    loadZones() {
      this.loadings.zone = true;
      return ZoneService.getZones()
        .then(zones => {
          this.rows = zones;
        })
        .finally(() => {
          this.loadings.zone = false;
        });
    },

    deployZone() {
      this.$router.push({
        name: 'deploy.zone',
      });
    },

    updateZone(zone) {
      this.$router.push({
        name: 'deploy.zone',
        query: {
          zoneId: zone.id,
        },
      });
    },

    confirmEnable(zone) {
      this.$tada
        .confirm({
          title: '显示可用区',
          text: `您确定要显示可用区 "${zone.name}" ？`,
          primaryText: '显示',
          primaryLevel: 'success',
        })
        .then(willAgree => {
          if (willAgree) {
            this.updateZone(zone.id, {
              ...zone,
              available: true,
            });
          }
        });
    },

    confirmDisable(zone) {
      this.$tada
        .confirm({
          title: '隐藏可用区',
          text: `您确定要隐藏可用区 "${zone.name}" ？`,
          primaryText: '隐藏',
          primaryLevel: 'danger',
        })
        .then(willAgree => {
          if (willAgree) {
            this.updateZone(zone.id, {
              ...zone,
              available: false,
            });
          }
        });
    },

    openClusterUrl(item) {
      window.open(item.clusterUrl, '_blank');
    },
  },
};
