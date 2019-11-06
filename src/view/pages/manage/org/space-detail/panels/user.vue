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
import tableView from '@/view/mixins/table-view';
import userManage from '@/view/mixins/user-manage';
import OrgService from '@/core/services/org.service';
import SpaceService from '@/core/services/space.service';
// dialogs
import AddUserDialog from '@/view/pages/dialogs/user/add-user';
import zoneAuthorizationDialog from '@/view/pages/dialogs/user/zone-authorization';

export default {
  name: 'OverviewPanel',

  extends: tableView('id', 10, 'username'),

  mixins: [userManage],

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
        { id: 'space_role', name: '项目组权限', filter: 'space_role' },
        { id: 'zone_space_roles', name: '可用区权限', filter: 'zone_auth' },
      ]);
      this.setTableOperations([
        { name: '修改用户权限', event: 'update-user-dialog' },
        { name: '可用区授权', event: 'on-authorize-zone' },
        { name: '移除', event: 'confirm-remove-user' },
      ]);
    },

    async loadUsers() {
      this.selectedUser = {};
      this.loadings.all = true;
      await this.$store.dispatch('getUserInfo');
      Promise.all([
        OrgService.getMembers(this.orgId),
        SpaceService.getMembers(this.spaceId),
      ])
        .then(([orgUsers, spaceUsers]) => {
          this.users = spaceUsers;
          this.allUsers = orgUsers;
        })
        .finally(() => {
          this.loadings.all = false;
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
