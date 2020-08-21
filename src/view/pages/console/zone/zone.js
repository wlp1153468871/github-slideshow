import { mapState } from 'vuex';

import ZoneAdminService from '@/core/services/zone-admin.service';

export default {
  name: 'Zone',
  data() {
    return {
      zoneList: [],
    };
  },

  computed: {
    ...mapState(['space', 'zone']),
  },

  created() {
    this.getzoneList();
  },

  methods: {
    getzoneList() {
      ZoneAdminService.getzoneList().then(res => {
        if (res) {
          this.zoneList = res;
        }
      });
    },
  },
};
