<template>
  <div>
    <dao-table-view
      :rows="rows"
      :config="tConfig"
      :loading="loadings.addService"
      @refresh="loadSpaces"
      @goto-space="gotoSpace"
      @confirm-delete-space="confirmDeleteSpace">
      <div slot="tool" class="dao-table-view-left-bar">
        <button
          class="dao-btn white has-icon"
          @click="openAddSpaceDialog()">
          <svg class="icon">
            <use xlink:href="#icon_plus-circled"></use>
          </svg>
          <span class="text">创建项目组</span>
        </button>
      </div>
    </dao-table-view>
    <!-- dialog start -->
    <add-space-dialog
      @create="createSpace"
      :visible="dialogConfigs.addSpace.visible"
      :orgId="orgId"
      @close="dialogConfigs.addSpace.visible = false">
    </add-space-dialog>
    <!-- dialog end -->
  </div>
</template>

<script>
import tableView from '@/view/mixins/table-view';
import SpaceService from '@/core/services/space.service';
import OrgService from '@/core/services/org.service';
import AddSpaceDialog from '@/view/pages/dialogs/space/add-space';

export default {
  name: 'Space',

  components: {
    AddSpaceDialog,
  },

  extends: tableView('id', 20, 'name'),

  props: {
    orgId: { type: String, default: '' },
  },

  created() {
    this.loadSpaces();
    const gotoDetail = item => {
      this.$router.push({
        name: 'manage.org.space',
        params: {
          org: item.organization_id,
          space: item.id,
        },
      });
    };
    const renderAdmin = (admins = []) => admins.map(x => x.username).join(',');
    this.setTableProps([
      {
        id: 'name',
        name: '项目组名',
        type: 'goto',
        other: { onClick: gotoDetail },
      },
      { id: 'short_name', name: '唯一标识' },
      { id: 'admins', name: '管理员', value: renderAdmin },
      { id: 'created_at', name: '创建日期', filter: 'unix_date' },
    ]);
    this.setTableOperations([
      { name: '查看详情', event: 'goto-space' },
      { name: '删除', event: 'confirm-delete-space' },
    ]);
  },
  data() {
    return {
      rows: [],
      spaces: [],
      loadings: {
        addService: false,
      },
      dialogConfigs: {
        addSpace: { visible: false },
      },
    };
  },
  methods: {
    loadSpaces() {
      this.loadings.addService = true;
      OrgService.getOrgSpaces(this.orgId)
        .then(spaces => {
          this.spaces = spaces;
          this.rows = spaces;
        })
        .finally(() => {
          this.loadings.addService = false;
        });
    },

    createSpace(space) {
      const { name, short_name, zoneIds } = space;
      const params = {
        organization_id: this.orgId,
        name,
        short_name,
        description: '',
        zone_ids: zoneIds,
      };
      SpaceService.createSpace(params).then(newSpace => {
        this.rows.push(newSpace);
        this.$noty.success('创建项目组成功!');
      });
    },

    openAddSpaceDialog() {
      this.dialogConfigs.addSpace.visible = true;
    },

    confirmDeleteSpace(space) {
      const { name } = space;
      this.$tada
        .confirm({
          title: '删除项目组',
          text: `您确定要删除项目组 ${name} 吗？`,
        })
        .then(willDel => {
          if (willDel) {
            this.deleteSpace(space.id);
          }
        });
    },

    deleteSpace(spaceId) {
      SpaceService.deleteSpace(spaceId)
        .then(() => {
          this.$noty.success('删除项目组成功!');
          this.loadSpaces();
        })
        .catch(() => {
          this.$noty.error('删除项目组失败');
        });
    },

    gotoSpace(space) {
      this.$router.push({
        name: 'manage.org.space',
        params: {
          org: this.orgId,
          space: space.id,
        },
      });
    },
  },
};
</script>
