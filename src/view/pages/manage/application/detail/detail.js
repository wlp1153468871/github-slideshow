import { mapState } from 'vuex';

import ServiceAdmin from '@/core/services/service-admin.service';
import MarkDown from '@/view/components/markdown/markdown.vue';

export default {
  name: 'AppStoreDetail',
  data() {
    return {
      activeName: 'first',
      select: 1,
      item: '全部',
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
      // 应用信息
      appInfo: '',
      // chart信息
      applicationInfos: '',
      chart: '',
    };
  },

  computed: {
    ...mapState(['space', 'zone']),
  },
  components: {
    MarkDown,
  },
  created() {
    this.getApp();
  },

  methods: {
    // 获取应用信息
    getApp() {
      ServiceAdmin.getApp(this.$route.params.id).then(res => {
        if (res) {
          this.appInfo = res;
        }
        this.getCharts();
      });
    },
    getCharts() {
      ServiceAdmin.getCharts(this.$route.params.id).then(res => {
        if (res) {
          this.applicationInfos = res;
          res.forEach(item => {
            this.chart = item.version;
          });
        }
        res.forEach(item => {
          if (item.version === this.chart) {
            this.appInfo.content = item.content;
          }
        });
      });
    },
  },
};
