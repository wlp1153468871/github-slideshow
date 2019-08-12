import { mapGetters } from 'vuex';
// pages
import SpaceUserList from '@/view/pages/manage/org/space-detail/panels/user';

export default {
  name: 'UserList',
  components: {
    SpaceUserList,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['spaceId', 'orgId']),
  },
};
