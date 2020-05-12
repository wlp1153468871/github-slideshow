import { mapGetters } from 'vuex';
import { first, isEmpty } from 'lodash';
// pages
import SpaceUserList from '@/view/pages/manage/org/space-detail/panels/user';
// ApprovalSetting
import ApprovalSetting from '@/view/pages/console/approval/approval-setting/approval-setting.vue';

export default {
  name: 'UserList',
  components: {
    SpaceUserList,
    ApprovalSetting,
  },
  data() {
    return {
      SIDE_BAR: {
        MEBMBER: {
          id: 'mebmber',
          canShow: this.$can('space.manage.users') || this.$can('organization.space'),
          name: '成员',
        },
        ZONE: {
          id: 'zone',
          canShow: false,
          name: '可用区',
        },
        SERVE: {
          id: 'serve',
          canShow: false,
          name: '服务',
        },
        APPROVE: {
          id: 'approve',
          canShow: this.$can('space.manage.approval'),
          name: '审批',
        },
        ADVANCED_SETTING: {
          id: 'setting',
          canShow: false,
          name: '高级',
        },
      },
      activeName: 'mebmber',
    };
  },
  created() {
    this.getActiveName();
  },
  methods: {
    getActiveName() {
      const tab = first(Object.values(this.SIDE_BAR).filter(t => t.canShow));
      if (isEmpty(tab)) {
        this.$noty.error('您暂无任何管理权限');
      } else {
        this.activeName = tab.id;
      }
    },
  },
  computed: {
    ...mapGetters(['spaceId', 'orgId']),
  },
};
