import { mapGetters } from 'vuex';
import { isEmpty } from 'lodash';
import ApprovalService from '@/core/services/approval.service';
import UserService from '@/core/services/user.service';
import { APPROVAL_TYPES } from '@/core/constants/constants';
import AddApproversDialog from '@/view/pages/dialogs/approval/add-approvers';

export default {
  name: 'ApprovalSetting',
  components: {
    AddApproversDialog,
  },
  created() {
    this.loadApprovalSetting();
    this.loadTenantUsers();
  },
  data() {
    return {
      APPROVAL_TYPES,
      approvalType: APPROVAL_TYPES.PASS_TYPE_ANYOF,
      approvalTypes: [
        {
          name: APPROVAL_TYPES.PASS_TYPE_ANYOF,
          headline: '任意一个管理员同意审批',
          description: '只需要任意一个项目组管理员（或有项目组管理权限）同意即可通过审批',
        },
        {
          name: APPROVAL_TYPES.PASS_TYPE_ALLOF,
          headline: '所有管理员同意审批',
          description: '需要所有项目组管理员（或有项目组管理权限）同意即可通过审批',
        },
        {
          name: APPROVAL_TYPES.PASS_TYPE_CUSTOM,
          headline: '指定的项目组成员同意审批',
          description: '需要指定的项目组成员同意即可通过审批',
        },
      ],
      config: {
        approval_type: APPROVAL_TYPES.PASS_TYPE_SEQ,
        is_need_approval: false,
        approval_users: [],
      },
      originalConfig: {}, // 原本的设置, 和 config 数据一致
      isEnableOrder: false,
      approvers: [], // approvers
      users: [], // all tenant users;
      dialogConfigs: {
        addApprovers: { visible: false },
      },
      membersMap: new Map(),
    };
  },
  computed: {
    ...mapGetters(['spaceId']),
    approverList() {
      if (!this.users.length) return [];
      // TODO(forat as same type);
      return (this.config.approval_users || []).map(x => {
        // x 可能是 user 对象, 也可能是 config.approval_users;
        return this.membersMap.get(x.user_id || x.id);
      });
    },
  },
  methods: {
    loadApprovalSetting() {
      ApprovalService.getConfig(this.spaceId).then(config => {
        this.originalConfig = { ...config };
        // isEmpty
        if (isEmpty(config)) {
          config = {
            approval_type: APPROVAL_TYPES.PASS_TYPE_ANYOF,
            is_need_approval: false,
            approval_users: [],
          };
        }
        let approvalType = config.approval_type;
        if (
          approvalType === APPROVAL_TYPES.PASS_TYPE_SEQ ||
          approvalType === APPROVAL_TYPES.PASS_TYPE_CUSTOM
        ) {
          this.isEnableOrder = APPROVAL_TYPES.PASS_TYPE_SEQ === approvalType;
          approvalType = APPROVAL_TYPES.PASS_TYPE_CUSTOM; // seq 在页面也标记为 custom;
        }
        this.config = config;
        this.approvalType = approvalType;
      });
    },

    loadTenantUsers() {
      UserService.getSpaceUsers(this.spaceId).then(users => {
        this.users = users;
        this.membersMap = new Map(users.map(x => [x.id, x]));
      });
    },

    save() {
      const { config } = this;
      config.approval_type = this.approvalType;
      if (this.approvalType === APPROVAL_TYPES.PASS_TYPE_CUSTOM) {
        config.approval_users = config.approval_users.map((x, index) => {
          return {
            user_id: x.user_id || x.id,
            order_number: this.isEnableOrder ? index : -1,
          };
        });
        if (this.isEnableOrder) {
          config.approval_type = APPROVAL_TYPES.PASS_TYPE_SEQ;
        }
      }
      ApprovalService.setConfig(this.spaceId, config).then(() => {
        this.$noty.success('审批设置修改成功!');
      });
    },

    onApproversChange({ approvers, isEnableOrder }) {
      this.config.approval_users = approvers;
      this.isEnableOrder = isEnableOrder;
    },

    showAddUserDialog() {
      this.dialogConfigs.addApprovers.visible = true;
    },
  },
};
