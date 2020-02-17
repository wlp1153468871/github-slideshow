import { orderBy } from 'lodash';
import { mapState } from 'vuex';
import tableView from '@/view/mixins/table-view';
import UserService from '@/core/services/user.service';
// dialogs
import UpdatePlatformUserDialog from '@/view/pages/dialogs/user/update-platform-user';
import CreateUserDialog from '@/view/pages/dialogs/user/create-user';

export default {
  name: 'UserList',

  extends: tableView('id', 10, 'username', 'asc'),

  components: {
    UpdatePlatformUserDialog,
    CreateUserDialog,
  },

  created() {
    this.initTableView();
    this.loadUsers();
  },

  data() {
    return {
      rows: [],
      users: [],
      selectedUser: {},
      dialogConfigs: {
        updateUser: { visible: false },
        createUser: { visible: false },
      },
      loadings: {
        users: false,
        create: false,
      },
      filterMethod: (data, filterKey) =>
        data.username.toLowerCase().includes(filterKey),
      other: { status: (_, item) => (!item.is_frozen ? 'SUCCESS' : 'DANGER') },
    };
  },

  computed: {
    ...mapState({
      self: 'user',
    }),
  },

  methods: {
    isFrozen(f) {
      return f ? '已冻结' : '正常';
    },
    initTableView() {
      const isFrozen = frozen => (frozen ? '已冻结' : '正常');
      const getStatus = (_, item) => (!item.is_frozen ? 'SUCCESS' : 'DANGER');
      this.setTableProps([
        { id: 'username', name: '用户名' },
        { id: 'email', name: '邮箱' },
        { id: 'phone_number', name: '手机号码', filter: 'otherwise' },
        { id: 'platform_role', name: '权限', filter: 'platform_role' },
        {
          id: 'registry_location',
          name: '用户类型',
          value(location) {
            if (location === 'local') {
              return '本地用户';
            }
            return 'SSO';
          },
        },
        {
          id: 'is_frozen',
          name: '状态',
          value: isFrozen,
          type: 'status',
          other: { status: getStatus },
        },
      ]);

      const isEnable = item => item.is_frozen;
      const isDisable = item => !item.is_frozen;
      const disableFrozen = item => item.id === this.self.id;

      this.setTableOperations([
        { name: '设置', event: 'update-user-dialog' },
        {
          name: '冻结',
          event: 'confirm-disable',
          visible: isDisable,
          disabled: disableFrozen,
          tooltip: '无法对自己操作',
        },
        { name: '激活', event: 'confirm-enable', visible: isEnable },
      ]);
    },

    loadUsers() {
      this.loadings.users = true;
      return UserService.getUsers()
        .then(users => {
          users = orderBy(users, 'username');
          this.users = users;
          this.rows = users;
        })
        .finally(() => {
          this.loadings.users = false;
        });
    },

    openCreateUserDialog() {
      this.dialogConfigs.createUser.visible = true;
    },

    updateUserDialog(user) {
      this.selectedUser = user;
      this.dialogConfigs.updateUser.visible = true;
    },

    disableConfirm(user) {
      this.$tada
        .confirm({
          title: '冻结用户',
          text: `您确定要冻结用户 ${user.username} 吗？`,
          primaryText: '冻结',
        })
        .then(willDisable => {
          if (!willDisable) return;
          this.disableUser(user);
        });
    },

    enableConfirm(user) {
      this.$tada
        .confirm({
          title: '激活用户',
          text: `您确定要激活用户 ${user.username} 吗？`,
          primaryText: '激活',
        })
        .then(willEnable => {
          if (!willEnable) return;
          this.enableUser(user);
        });
    },

    disableUser(user) {
      const params = {
        is_frozen: true,
      };
      return UserService.updateUser(user.id, params).then(newUser => {
        this.applyUserChange(newUser);
        this.$noty.success('冻结用户成功');
        this.loadUsers();
      });
    },

    enableUser(user) {
      const params = {
        is_frozen: false,
      };
      return UserService.updateUser(user.id, params).then(newUser => {
        this.applyUserChange(newUser);
        this.$noty.success('激活用户成功');
        this.loadUsers();
      });
    },

    updateUser(user) {
      return UserService.updateUser(
        user.id, // userId
        { platform_role: user.role }, // platform role
      )
        .then(newUser => {
          try {
            this.applyUserChange(newUser);
            this.$noty.success('设置用户权限成功');
          } catch (err) {
            const { data = {} } = err;
            this.$noty.error(data.error_info);
          }
        })
        .finally(() => {
          this.dialogConfigs.updateUser.visible = false;
          this.selectedUser = {};
        });
    },

    applyUserChange(newItem) {
      this.rows = this.users.map(item => {
        if (this.self.id === item.id) {
          this.$store.commit('LOAD_USER_SUCCESS', { user: item });
        }
        return item.id === newItem.id ? newItem : item;
      });
    },

    createUser(vars) {
      const {
        pwd, confirm_pwd, phone, ...user
      } = vars;
      user.password = pwd;
      user.phone_number = phone;

      this.loadings.create = true;
      UserService.createUser(user)
        .then(newUser => {
          this.rows.push(newUser);
          this.$refs.createUser.onClose();
          this.$noty.success('创建用户成功');
        })
        .finally(() => {
          this.loadings.create = false;
        });
    },
    handleOperate(command, zone) {
      if (command === 'enable') {
        this.enableUser(zone);
      }
      if (command === 'disable') {
        this.disableUser(zone);
      }
      if (command === 'edit') {
        this.updateUserDialog(zone);
      }
    },
  },
};
