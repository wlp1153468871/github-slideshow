import { mapState } from 'vuex';
import OrgQuotaRequest from '@/view/pages/manage/org/org-detail/panels/quota-request';

export default {
  name: 'QuotaField',
  components: {
    OrgQuotaRequest,
  },
  computed: {
    ...mapState(['org']),
  },
};
