<template>
  <div class="org-user">
    <dao-table-view
      :rows="rows"
      :config="tConfig"
      :showRefresh="canView"
      :hideRefresh="canView"
      @refresh="loadOrgUsers"
      :loading="this.loadings.all"
      @update-user-dialog="updateUserDialog"
      @confirm-remove-user="confirmRemoveUser"
    >
      <div slot="tool">
        <div v-if="canCreat" class="dao-btn has-icon white" @click="openAddUserDialog()">
          <svg class="icon">
            <use xlink:href="#icon_plus-circled"></use>
          </svg>
          <span class="text">添加用户</span>
        </div>
      </div>
    </dao-table-view>

    <!--dialog start -->
    <add-user-dialog
      :roles="roles"
      :users="availableUsers"
      @add="addUser"
      @search="searchUser"
      :visible="dialogConfigs.addUser.visible"
      @close="dialogConfigs.addUser.visible = false"
    >
    </add-user-dialog>

    <update-org-user-dialog
      :user="selectedUser"
      :roles="roles"
      @update="updateUser"
      :visible="dialogConfigs.updateUser.visible"
      @close="dialogConfigs.updateUser.visible = false"
    >
    </update-org-user-dialog>
    <!-- dialog end -->
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import tableView from '@/view/mixins/table-view';
import userManage from '@/view/mixins/user-manage';
import OrgService from '@/core/services/org.service';
import UserService from '@/core/services/user.service';
import RoleService from '@/core/services/role.service';
// dialogs
import AddUserDialog from '@/view/pages/dialogs/org/add-user';
import UpdateOrgUserDialog from '@/view/pages/dialogs/user/update-org-user';

export default {
  name: 'OrgUserPanel',

  extends: tableView('id', 10, 'username'),

  mixins: [userManage],

  components: {
    AddUserDialog,
    UpdateOrgUserDialog,
  },

  props: {
    orgId: { type: String, default: () => '' },
    canCreat: { type: Boolean, default: () => false },
    canUpdate: { type: Boolean, default: () => false },
    canDelete: { type: Boolean, default: () => false },
    canView: { type: Boolean, default: () => false },
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
        addUser: { visible: false },
        updateUser: { visible: false },
      },
      roles: [],
    };
  },

  computed: {
    ...mapState(['user', 'isManageView']),
    ...mapGetters(['userName', 'isOrganizationAdmin']),
  },

  created() {
    this.initTableView();
    if (this.canView) {
      this.loadOrgRoles();
    }
  },

  watch: {
    orgId: {
      immediate: true,
      handler(orgId, prevOrgId) {
        // loadOrgUsers 之前需要判断查看权限 this.canView
        if (orgId !== '' && orgId !== prevOrgId) {
          if (this.canView) {
            this.loadOrgUsers(orgId);
          } else {
            this.$noty.error('您暂无查询项目组权限');
          }
        }
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
          name: '租户权限',
          value(roles) {
            let text = '';
            roles.forEach(role => {
              if (role.scope === 'organization') {
                text = role.name;
              }
            });
            return text;
          },
          filter: 'role_format',
        },
      ]);
      const isSelf = item => item.username === this.userName && this.isOrganizationAdmin;
      if (this.canUpdate || this.canDelete) {
        this.setTableOperations([
          {
            name: '修改权限',
            event: 'update-user-dialog',
            tooltip: '无法对自己操作',
            visible: this.canUpdate,
          },
          {
            name: '移除',
            event: 'confirm-remove-user',
            disabled: this.isManageView ? false : isSelf,
            tooltip: '无法对自己操作',
            visible: this.canDelete,
          },
        ]);
      }
    },

    loadOrgUsers() {
      this.loadings.all = true;
      OrgService.getMembers(this.orgId)
        .then(users => {
          this.users = users;
          this.rows = users;
        })
        .finally(() => {
          this.loadings.all = false;
        });
    },

    loadOrgRoles() {
      RoleService.getRoles({
        scope: 'organization',
        organizationId: this.orgId,
      }).then(roles => {
        this.roles = roles;
      });
    },

    loadAllUsers(q) {
      UserService.getUsers(q).then(users => {
        this.allUsers = users;
      });
    },

    openAddUserDialog() {
      this.dialogConfigs.addUser.visible = true;
    },

    addUser({ user, role }, isNewUser) {
      UserService.addOrgUser(this.orgId, user.id)
        .then(newUsers => {
          this.rows.push(newUsers);
          this.$noty.success('添加用户成功');
          this.setOrgRole(role, user.id, isNewUser);
        })
        .catch(() => {
          this.$noty.error('添加用户失败');
        });
    },

    confirmRemoveUser(user) {
      this.$tada
        .confirm({
          title: '移除用户',
          text: `
          您确定要移除用户 ${user.username} 吗？
          同时, 该用户将从本租户下的所有项目组移出
          `,
          primaryText: '移除',
        })
        .then(willDelete => {
          if (!willDelete) return;
          this.removeUser(user);
        });
    },

    removeUser(user) {
      return UserService.removeOrgUser(this.orgId, user.id)
        .then(() => {
          const index = this.users.findIndex(v => v.id === user.id);
          this.users.splice(index, 1);
          this.$noty.success('删除用户成功');
        })
        .catch(() => {
          this.$noty.error('删除用户失败, 请稍后再试');
        });
    },

    updateUserDialog(user) {
      this.selectedUser = user;
      this.dialogConfigs.updateUser.visible = true;
    },

    updateUser(role) {
      this.setOrgRole(role, this.selectedUser.id);
    },

    setOrgRole(role, userId, isNewUser) {
      const orgParams = {
        userId,
        roleId: role.id,
        data: {
          organizationId: this.orgId,
          scope: role.scope,
        },
      };
      RoleService.setRole(orgParams)
        .then(() => {
          this.$noty.success(isNewUser ? '权限初始化成功' : '权限修改成功');
          this.loadOrgUsers();
        })
        .catch(() => {
          this.$noty.error(isNewUser ? '权限初始化失败' : '权限修改失败');
        });
    },

    searchUser(keyword) {
      this.loadAllUsers(keyword);
    },
  },
};
</script>
