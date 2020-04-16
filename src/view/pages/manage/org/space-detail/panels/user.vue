<template>
  <div>
    <dao-table-view
      :rows="rows"
      :config="tConfig"
      :loading="loadings.all"
      @refresh="onRefresh"
      @update-user-dialog="updateUserDialog"
      @confirm-remove-user="confirmRemoveUser"
    >
      <div slot="tool">
        <button :disabled="loadings.all" class="dao-btn has-icon blue" @click="openAddUserDialog()">
          <svg class="icon">
            <use xlink:href="#icon_plus-circled"></use>
          </svg>
          <span class="text">添加用户</span>
        </button>
      </div>
    </dao-table-view>

    <!-- dialog start -->
    <add-user-dialog
      :visible="dialogConfigs.updateUser.visible"
      :users="availableUsers"
      :model="selectedUser"
      :zonerole="zoneRoles"
      :spacerole="spaceRoles"
      :zones="zones"
      :space-id="spaceId"
      @refresh="onRefresh"
      @close="onAddUserClose"
    >
    </add-user-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import tableView from '@/view/mixins/table-view';
import userManage from '@/view/mixins/user-manage';
import OrgService from '@/core/services/org.service';
import SpaceService from '@/core/services/space.service';
import RoleService from '@/core/services/role.service';

// dialogs
import AddUserDialog from '@/view/pages/dialogs/user/add-user';

export default {
  name: 'SpaceUserPanel',

  extends: tableView('id', 10, 'username'),

  mixins: [userManage],

  computed: {
    ...mapGetters(['userName']),
  },

  components: {
    AddUserDialog,
  },

  props: {
    spaceId: { type: String, default: '' },
    orgId: { type: String, default: '' },
  },

  created() {
    this.initTableView();
    this.loadUsers();
    this.loadZoneRoles();
  },

  data() {
    return {
      rows: [],
      users: [],
      allUsers: [], // for select
      selectedUser: {},
      loadings: {
        all: false,
      },
      dialogConfigs: {
        updateUser: { visible: false },
      },
      zones: [],
      zoneRoles: {},
      spaceRoles: [],
    };
  },

  watch: {
    users: {
      immediate: true,
      handler(users) {
        this.rows = users;
      },
    },
  },

  methods: {
    onRefresh() {
      this.loadUsers();
      this.loadZoneRoles();
    },
    initTableView() {
      this.setTableProps([
        { id: 'username', name: '用户名' },
        { id: 'phone_number', name: '手机' },
        { id: 'email', name: '邮箱' },
        {
          id: 'roles',
          name: '项目组权限',
          value(roles) {
            let text = '';
            roles.forEach(role => {
              if (role.scope === 'space') {
                text = role.name;
              }
            });
            return text;
          },
          filter: 'role_format',
        },
        {
          id: 'zone_space_roles',
          name: '可用区权限',
          value(zone_space_roles) {
            return zone_space_roles
              .map(r => `${r.zone_name}:\t ${r.zone_role || '无权限'}`)
              .join(';\n');
          },
          filter: 'role_format',
        },
      ]);
      this.setTableOperations([
        {
          name: '修改用户权限',
          event: 'update-user-dialog',
          // disabled: item => item.username === this.userName,
          tooltip: '无法修改本人权限，防止降级',
        },
        {
          name: '移除',
          event: 'confirm-remove-user',
          visible: item => {
            let status = '';
            if (item.username === this.userName) {
              status = false;
            } else {
              status = true;
            }
            return status;
          },
        },
      ]);
    },

    async loadUsers() {
      this.selectedUser = {};
      this.loadings.all = true;
      // await this.$store.dispatch('getUserInfo');
      Promise.all([
        OrgService.getMembers(this.orgId),
        SpaceService.getMembers(this.spaceId),
        // SpaceService.getScopeUsers(this.spaceId),
        // get space roles传给编辑角色
        RoleService.getRoles({
          scope: 'space',
          space: this.spaceId,
        }),
      ])
        .then(([orgUsers, spaceUsers, spaceRoles]) => {
          this.allUsers = orgUsers;
          this.users = spaceUsers;
          this.spaceRoles = spaceRoles;
        })
        .finally(() => {
          this.loadings.all = false;
        });
    },

    loadZoneRoles() {
      SpaceService.getSpaceZones(this.spaceId)
        .then(zones => {
          this.zones = zones.sort((a, b) => a.createdAt - b.createdAt);
        })
        .then(() => {
          this.zones.forEach(zone => {
            const { id, name } = zone;
            RoleService.getRoles({
              scope: zone.name.includes('k8s') ? 'zone.k8s' : 'zone.ocp',
              // scope: `zone.${zone.type}`,
              // scope: `zone.${zone.version.type}`,
              space: this.spaceId,
              zone: id,
            }).then(roleList => {
              this.zoneRoles[name] = roleList;
            });
          });
        });
    },

    openAddUserDialog() {
      this.dialogConfigs.updateUser.visible = true;
    },

    confirmRemoveUser(user) {
      this.$tada
        .confirm({
          title: '移除用户',
          text: `您确定要移除用户 ${user.username} 吗？`,
          primaryText: '移除',
        })
        .then(willDelete => {
          if (!willDelete) return;
          this.removeUser(user);
        });
    },

    removeUser(user) {
      return SpaceService.removeUserFromSpace(this.spaceId, user.id).then(() => {
        const index = this.users.findIndex(v => v.id === user.id);
        this.users.splice(index, 1);
        this.$noty.success('移除用户成功');
      });
    },

    updateUserDialog(user) {
      this.selectedUser = user;
      this.dialogConfigs.updateUser.visible = true;
    },

    onAddUserClose() {
      this.selectedUser = {};
      this.dialogConfigs.updateUser.visible = false;
    },
  },
};
</script>
