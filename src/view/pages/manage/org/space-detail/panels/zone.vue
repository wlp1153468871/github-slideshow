<template>
  <div>
    <dao-table-view :rows="rows" :config="tConfig" @refresh="loadSpaceZones" :loading="loading">
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
      :orgId="orgId"
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
import SpaceService from '@/core/services/space.service';
import AddZoneDialog from '@/view/pages/dialogs/org/add-zone';

export default {
  name: 'OrgZonePanel',

  components: {
    AddZoneDialog,
  },

  extends: tableView('id', 20, 'name'),

  props: {
    spaceId: { type: String, default: '' },
  },

  data() {
    return {
      rows: [],
      zones: [],
      loading: false,
      dialogConfigs: {
        addZone: { visible: false },
      },
      orgId: '',
    };
  },

  created() {
    const { org } = this.$route.params;
    this.orgId = org;
    this.initTableView();
    this.loadSpaceZones();
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

    loadSpaceZones() {
      this.loading = true;
      SpaceService.getSpaceZones(this.spaceId)
        .then(zones => {
          this.rows = zones;
          return zones;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    openClusterUrl(item) {
      window.open(item.clusterUrl, '_blank');
    },

    addZone(zoneIds) {
      SpaceService.createSpaceZone(this.spaceId, { zone_ids: zoneIds }).then(() => {
        this.$noty.success('添加可用区成功');
        this.loadSpaceZones();
      });
    },

    openAddZoneDialog() {
      this.dialogConfigs.addZone.visible = true;
    },
  },
};
</script>
