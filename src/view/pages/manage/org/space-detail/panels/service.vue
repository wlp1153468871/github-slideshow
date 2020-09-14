<template>
  <div class="space-service">
    <!-- 服务 -->
    <dao-table-view
      :rows="services"
      :config="tConfig"
      :loading="loading"
      @refresh="loadSpaceServices"
      @remove-space-service="onDelete"
    >
      <div slot="tool" class="dao-table-view-left-bar">
        <button class="dao-btn has-icon white" @click="openAddServiceDialog()">
          <svg class="icon">
            <use xlink:href="#icon_plus-circled"></use>
          </svg>
          <span class="text">添加服务</span>
        </button>
      </div>
    </dao-table-view>

    <!-- dialog start -->
    <add-service-dialog
      ref="addServiceDialog"
      :services="allServices"
      :used-services="services"
      :visible="dialogConfigs.addService.visible"
      @create="addSpaceService"
      @close="dialogConfigs.addService.visible = false"
    >
    </add-service-dialog>
    <!-- dialog end -->
  </div>
</template>

<script>
import tableView from '@/view/mixins/table-view';
import AddServiceDialog from '@/view/pages/dialogs/org/add-service';
import ServiceService from '@/core/services/service.service';
import SpaceService from '@/core/services/space.service';

export default {
  name: 'ServicePanel',

  extends: tableView('id', 10, 'name'),

  components: {
    AddServiceDialog,
  },

  props: {
    spaceId: { type: String, default: '' },
    orgId: { type: String, default: '' },
  },

  data() {
    return {
      service: {
        name: '',
        quota_usages: [],
      },
      dialogConfigs: {
        addService: { visible: false },
      },
      services: [],
      allServices: [],
      loading: true,
    };
  },

  created() {
    this.initTableView();
    this.loadServices();
    this.loadSpaceServices();
  },

  methods: {
    initTableView() {
      this.setTableProps([
        { id: 'name', name: '服务名' },
        { id: 'zone.name', name: '可用区', value: 'zone.name' },
        { id: 'instance_count', name: '实例数' },
      ]);
      this.setTableOperations([
        {
          name: '移除',
          svg: 'trash',
          event: 'remove-space-service',
        },
      ]);
    },

    openAddServiceDialog() {
      this.dialogConfigs.addService.visible = true;
    },

    onDelete(service) {
      this.$tada
        .confirm({
          title: '移除服务',
          text: `您确定要移除服务 ${service.name} 吗？`,
          primaryText: '移除',
        })
        .then(willDelete => {
          if (willDelete) {
            this.removeSpaceService(service.id);
          }
        });
    },

    addSpaceService(service) {
      SpaceService.addSpaceService(this.spaceId, service.id).then(() => {
        this.loadSpaceServices();
        this.$noty.success('添加服务成功');
      });
    },

    removeSpaceService(serviceId) {
      SpaceService.deleteSpaceService(this.spaceId, serviceId).then(() => {
        const index = this.services.findIndex(v => v.id === serviceId);
        this.services.splice(index, 1);
        this.$noty.success('移除服务成功');
      });
    },

    loadServices() {
      ServiceService.getAvailableServices()
        .then(services => {
          this.allServices = services;
        })
        .finally(() => {});
    },

    loadSpaceServices() {
      this.loading = true;
      SpaceService.listSpaceServices(this.spaceId)
        .then((services = []) => {
          this.services = [];
          services.forEach(item => {
            if (item.available === 'available') {
              this.services.push(item);
            }
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss">
.org-service {
  .dao-setting-layout {
    .dao-view-sidebar {
      float: left;
    }

    .dao-view-content {
      min-width: calc(100% - 200px);
      margin-left: 200px;
      float: left;
    }
  }
}
</style>
