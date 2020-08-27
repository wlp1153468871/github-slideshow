import { mapState } from 'vuex';

import ServiceAdmin from '@/core/services/service-admin.service';

export default {
  name: 'AppStoreDetail',
  data() {
    return {
      activeName: 'first',
      select: 1,
      item: '全部',
      items: [
        {
          text: '1.9.1',
          value: 1,
        },
        {
          text: '1.10.2',
          value: 2,
        },
        {
          text: '2.1.1',
          value: 3,
        },
      ],
      tableData: [
        {
          groupName: '数据应用',
          groupUnique: 'data-app',
          tenantName: '大数据团队',
          tenantUnique: 'bigdata',
          date: '2020-5-23',
        },
      ],
      tableData1: [
        {
          exampleName: 'example',
          chartType: '1.9.1',
          applyName: '0.25.0',
          tenant: 'demo/demo',
          state: '运行中',
          creator: 'User01',
          date: '2020-5-23 12:34',
        },
      ],
      appInfo: '',
    };
  },

  computed: {
    ...mapState(['space', 'zone']),
  },

  created() {
    this.getApp();
  },

  methods: {
    getApp() {
      ServiceAdmin.getApp(this.$route.params.id).then(res => {
        if (res) {
          console.log(res);
          this.appInfo = res;
        }
      });
    },
  },
};
