import { mapState } from 'vuex';
import OrgUserList from '../../../manage/org/org-detail/panels/user';

export default {
  name: 'UserList',
  components: {
    OrgUserList,
  },
  computed: {
    ...mapState(['org']),
  },
};
