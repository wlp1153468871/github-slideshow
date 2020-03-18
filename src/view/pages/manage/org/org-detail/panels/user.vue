<template>
  <div class="org-user">
    <dao-table-view
      :rows="rows"
      :config="tConfig"
      @refresh="loadOrgUsers"
      :loading="this.loadings.all"
      @update-user-dialog="updateUserDialog"
      @confirm-remove-user="confirmRemoveUser">
      <div slot="tool">
        <div
          class="dao-btn has-icon white"
          @click="openAddUserDialog()">
          <svg class="icon">
            <use xlink:href="#icon_plus-circled"></use>
          </svg>
          <span class="text">添加用户</span>
        </div>
      </div>
    </dao-table-view>

    <!--dialog start -->
    <add-user-dialog
      :roles="ROLES"
      :users="availableUsers"
      @add="addUser"
      @search="searchUser"
      :visible="dialogConfigs.addUser.visible"
      @close="dialogConfigs.addUser.visible = false">
    </add-user-dialog>

    <update-org-user-dialog
      :user="selectedUser"
      :user-role="selectedUser.organization_role"
      :roles="ROLES"
      @update="updateUser"
      :visible="dialogConfigs.updateUser.visible"
      @close="dialogConfigs.updateUser.visible = false">
    </update-org-user-dialog>
    <!-- dialog end -->
  </div>
</template>

<script>
import { ORG_ROLE } from '@/core/constants/role';
import { mapState } from 'vuex';
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
      // TODO: replace with ORG_ROLE_LABEL
      ROLES: [
        { value: ORG_ROLE.MEMBER, text: '租户普通用户' },
        { value: ORG_ROLE.ADMIN, text: '租户管理员' },
      ],
    };
  },

  computed: {
    ...mapState(['user']),
  },

  created() {
    this.initTableView();
    this.loadOrgRoles();
  },

  watch: {
    orgId: {
      immediate: true,
      handler(orgId, prevOrgId) {
        if (orgId !== '' && orgId !== prevOrgId) {
          this.loadOrgUsers(orgId);
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
        // { id: 'organization_role', name: '租户权限', filter: 'org_role' },
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
        },
      ]);
      const isSelf = item => item.id === this.user.id;
      this.setTableOperations([
        {
          name: '修改权限',
          event: 'update-user-dialog',
          disabled: isSelf,
          tooltip: '无法对自己操作',
        },
        {
          name: '移除',
          event: 'confirm-remove-user',
        },
      ]);
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
        this.ROLES = roles;
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

    addUser({ user, role }) {
      this.setOrgRole(role, user.id);
      const params = {
        organization_role: 'organization_admin',
      };
      UserService.addOrgUser(this.orgId, user.id, params)
        .then(newUsers => {
          this.rows.push(newUsers);
          this.$noty.success('添加用户成功');
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

    updateUser(role, newRole) {
      const params = {
        organization_role: role,
      };
      this.setOrgRole(newRole, this.selectedUser.id);
      return UserService.updateOrgUser(
        this.orgId,
        this.selectedUser.id,
        params,
      ).then(newUser => {
        const index = this.rows.findIndex(x => x.id === this.selectedUser.id);
        this.rows.splice(index, 1, newUser);
        // this.$noty.success('权限修改成功');
      });
    },

    setOrgRole(role, userId) {
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
          this.$noty.success('权限修改成功');
          this.loadOrgUsers();
        });
    },

    searchUser(keyword) {
      this.loadAllUsers(keyword);
    },
  },
};
</script>
