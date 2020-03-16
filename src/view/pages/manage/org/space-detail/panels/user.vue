<template>
  <div>
    <dao-table-view
      :rows="rows"
      :config="tConfig"
      :loading="loadings.all"
      @refresh="loadUsers"
      @update-user-dialog="updateUserDialog"
      @on-authorize-zone="onAuthorizeZone"
      @confirm-remove-user="confirmRemoveUser">
      <div slot="tool">
        <button
          :disabled="loadings.all"
          class="dao-btn has-icon blue"
          @click="openAddUserDialog()">
          <svg class="icon">
            <use xlink:href="#icon_plus-circled"></use>
          </svg>
          <span class="text" >添加用户</span>
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
      :space-id="spaceId"
      @refresh="loadUsers"
      @close="onAddUserClose">
    </add-user-dialog>

    <zone-authorization-dialog
      :model="selectedUser"
      :visible="dialogConfigs.zoneAuthorization.visible"
      :space-id="spaceId"
      @refresh="loadUsers"
      @close="dialogConfigs.zoneAuthorization.visible = false">
    </zone-authorization-dialog>
    <!-- dialog end -->
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import tableView from '@/view/mixins/table-view';
import userManage from '@/view/mixins/user-manage';
import OrgService from '@/core/services/org.service';
import SpaceService from '@/core/services/space.service';
import RoleService from '@/core/services/role.service';

// dialogs
import AddUserDialog from '@/view/pages/dialogs/user/add-user';
import zoneAuthorizationDialog from '@/view/pages/dialogs/user/zone-authorization';

export default {
  name: 'OverviewPanel',

  extends: tableView('id', 10, 'username'),

  mixins: [userManage],

  computed: {
    ...mapState(['zones']),
    ...mapGetters(['userName']),
  },

  components: {
    AddUserDialog,
    zoneAuthorizationDialog,
  },

  props: {
    spaceId: { type: String, default: '' },
    orgId: { type: String, default: '' },
  },

  created() {
    this.initTableView();
    this.loadUsers();
  },

  data() {
    return {
      rows: [],
      users: [],
      allUsers: [],
      selectedUser: {},
      loadings: {
        all: false,
      },
      dialogConfigs: {
        updateUser: { visible: false },
        zoneAuthorization: { visible: false },
      },
      zoneRoles: {},
      spaceRoles: {},
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
        },
        {
          id: 'roles',
          name: '可用区权限',
          value(roles) {
            let text = '';
            roles.forEach(role => {
              if (role.scope.includes('zone')) {
                text += `${role.scope}: ${role.name}  `;
              }
            });
            return text;
          },
        },
        // { id: 'roles', name: '权限', value: 'roles', filter: 'role_format' },
        // { id: 'space_role', name: '项目组权限', filter: 'space_role' },
        // { id: 'zone_space_roles', name: '可用区权限', filter: 'zone_auth' },
      ]);
      this.setTableOperations([
        { name: '修改用户权限', event: 'update-user-dialog' },
        // { name: '可用区授权', event: 'on-authorize-zone' },
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
      this.loadZoneRoles();
      this.selectedUser = {};
      this.loadings.all = true;
      await this.$store.dispatch('getUserInfo');
      Promise.all([
        OrgService.getMembers(this.orgId),
        SpaceService.getMembers(this.spaceId),
        // SpaceService.getScopeUsers(this.spaceId),
        // get space roles传给编辑角色
        RoleService.getRoles({
          scope: 'space',
          space: this.spaceId,
        }),
        // RoleService.getRoles({
        //   scope: 'zone.k8s',
        //   space: this.spaceId,
        //   zone: this.zones.id,
        // }),
      ])
        .then(([orgUsers, spaceUsers, spaceRoles]) => {
          this.users = spaceUsers;
          this.allUsers = orgUsers;
          // console.log('space roles', spaceRoles);
          this.spaceRoles = spaceRoles;
        })
        .finally(() => {
          this.loadings.all = false;
        });
    },

    loadZoneRoles() {
      // console.log('this.zones', this.zones);
      this.zones.forEach(zone => {
        // console.log('zone', zone);
        const { id, name } = zone;
        // console.log('zoneId', id);
        // console.log('areaName', name);
        const key = name;
        RoleService.getRoles({
          scope: zone.name.includes('k8s') ? 'zone.k8s' : 'zone.ocp',
          space: this.spaceId,
          zone: id,
        })
          .then(roleList => {
            // console.log('zone roleList', roleList);
            // console.log('key', key);
            this.zoneRoles[key] = roleList;
            // console.log(this.zoneRoles);
          });
      });
    },

    openAddUserDialog() {
      this.dialogConfigs.updateUser.visible = true;
    },

    confirmRemoveUser(user) {
      console.log('user', user);
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

    onAuthorizeZone(user) {
      this.selectedUser = user;
      this.dialogConfigs.zoneAuthorization.visible = true;
    },

    onAddUserClose() {
      this.selectedUser = {};
      this.dialogConfigs.updateUser.visible = false;
    },
  },
};
</script>
