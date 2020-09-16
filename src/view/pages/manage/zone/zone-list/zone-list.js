import ZoneService from '@/core/services/zone.service';

export default {
  name: 'ZoneList',

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
      filterMethod: this.filterZones,
      other: {
        status: (_, item) => (!item.available ? 'STOPED' : 'SUCCESS'),
      },
      total: 0,
    };
  },

  created() {
    // 有权限查看 无权限则提示
    if (this.$can('platform.zone.get')) {
      this.loadZones();
    } else {
      this.$noty.error('您暂无可用区查看权限');
    }
  },

  methods: {
    renderStatus(status) {
      return status ? '显示' : '隐藏';
    },

    loadZones(page, pageSize, q) {
      this.loadings.zone = true;
      return ZoneService.getZonesByList(page, pageSize, q)
        .then(zones => {
          this.rows = zones;
          // this.rows = zones.data;
          console.log(zones);
          this.total = zones.total;
        })
        .finally(() => {
          this.loadings.zone = false;
        });
    },

    filterZones(filterKey, pageSize) {
      if (pageSize) {
        this.loadZones(1, pageSize, filterKey);
      }
    },
    switchPage(page, pageSize, filterKey) {
      this.loadZones(page, pageSize, filterKey);
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
            ZoneService.updateZone(zone.id, {
              ...zone,
              available: true,
            })
              .then(() => {
                this.loadZones();
                this.$noty.success('操作成功');
              })
              .catch(() => {
                this.$noty.error('操作失败');
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
            ZoneService.updateZone(zone.id, {
              ...zone,
              available: false,
            })
              .then(() => {
                this.loadZones();
                this.$noty.success('操作成功');
              })
              .catch(() => {
                this.$noty.error('操作失败');
              });
          }
        });
    },

    handleOperate(command, zone) {
      if (command === 'enable') {
        this.confirmEnable(zone);
      }
      if (command === 'disable') {
        this.confirmDisable(zone);
      }
      if (command === 'edit') {
        this.updateZone(zone);
      }
    },

    openClusterUrl(item) {
      window.open(item.clusterUrl, '_blank');
    },
  },
};
