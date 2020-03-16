import { mapGetters } from 'vuex';
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
        MEBMBER: '成员',
        ZONE: '可用区',
        SERVE: '服务',
        APPROVE: '审批',
        ADVANCED_SETTING: '高级',
      },
      activeName: 'mebmber',
    };
  },
  computed: {
    ...mapGetters(['spaceId', 'orgId']),
  },
};
