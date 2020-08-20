import { mapState } from 'vuex';

import ServiceAdmin from '@/core/services/service-admin.service';

export default {
  name: 'Service',
  data() {
    return {
      select: 1,
      items: [
        {
          text: '全部',
          value: 1,
        },
        {
          text: '选项1',
          value: 2,
        },
      ],
      tableData: [
        {
          serviceName: 'ectd',
          zone: '上海-dev',
          supplier: 'RedHat',
          state: '已上架',
          type: 'Operator',
          serviceNum: 1,
          classify: '数据库',
          date: '2020-05-23 12:24',
        },
        {
          serviceName: 'ectd',
          zone: '上海-dev',
          supplier: 'RedHat',
          state: '已上架',
          type: 'Operator',
          serviceNum: 1,
          classify: '数据库',
          date: '2020-05-23 12:24',
        },
      ],
      // 应用
      appInfo: [],
    };
  },

  computed: {
    ...mapState(['space', 'zone']),
  },

  created() {
    this.getAllApp();
  },

  methods: {
    linkToDetail() {
      this.$router.push({ name: 'service.detail' });
    },

    getAllApp() {
      ServiceAdmin.getAllApp().then(res => {
        if (res) {
          console.log(res);
          this.appInfo = res;
        }
      });
    },
  },
};
