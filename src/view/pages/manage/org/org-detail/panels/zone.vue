<template>
  <div>
    <dao-table-view :rows="rows" :config="tConfig">
      <div slot="tool" class="dao-table-view-left-bar">
        <button class="dao-btn white has-icon" @click="openAddZoneDialog()">
          <svg class="icon">
            <use xlink:href="#icon_plus-circled"></use>
          </svg>
          <span class="text">添加可用区</span>
        </button>
      </div>
    </dao-table-view>
    <!-- dialog start -->
    <add-zone-dialog
      :zone-list="rows"
      @add="addZone"
      :visible="dialogConfigs.addZone.visible"
      @close="dialogConfigs.addZone.visible = false"
    >
    </add-zone-dialog>
    <!-- dialog end -->
  </div>
</template>

<script>
import tableView from '@/view/mixins/table-view';
import ZoneService from '@/core/services/zone.service';
import AddZoneDialog from '@/view/pages/dialogs/org/add-zone';

export default {
  name: 'OrgZonePanel',

  components: {
    AddZoneDialog,
  },

  extends: tableView('id', 20, 'name'),

  props: {
    orgId: { type: String, default: '' },
  },

  data() {
    return {
      rows: [],
      zones: [],
      dialogConfigs: {
        addZone: { visible: false },
      },
    };
  },

  created() {
    this.initTableView();
    this.loadOrgZones();
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
          id: 'available',
          name: '状态',
          value: renderStatus,
          type: 'status',
          other: { status: getStatus },
        },
        {
          id: 'createdAt',
          name: '创建时间',
          filter: 'unix_date',
        },
      ]);
    },

    loadOrgZones() {
      ZoneService.getOrgZones(this.orgId).then(zones => {
        this.rows = zones;
        return zones;
      });
    },

    openClusterUrl(item) {
      window.open(item.clusterUrl, '_blank');
    },

    addZone(zoneIds) {
      ZoneService.addOrgZone(this.orgId, { zone_ids: zoneIds }).then(() => {
        this.$noty.success('添加可用区成功');
        this.loadOrgZones();
      });
    },

    openAddZoneDialog() {
      this.dialogConfigs.addZone.visible = true;
    },
  },
};
</script>
