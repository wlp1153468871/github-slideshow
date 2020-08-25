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
      ZoneAdminService.getzoneList(this.space.id).then(res => {
        if (res) {
          this.zoneList = res;
        }
      });
    },
  },
};
