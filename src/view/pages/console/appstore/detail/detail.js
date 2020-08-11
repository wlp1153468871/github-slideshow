import { mapState } from 'vuex';

import AppStoreService from '@/core/services/appstore.service';

export default {
  name: 'AppStoreDetail',

  data() {
    return {
      value: '',
      // 选中状态
      selectState: 0,
      activeName: 'first',
      tableData: [
        {
          exampleName: 'nginx-example-1',
          state: '成功',
          type: '1.9.1',
          creator: 'admin',
          date: '2020-5-6 12:23',
        },
        {
          exampleName: 'nginx-example-1',
          state: '成功',
          type: '1.9.1',
          creator: 'admin',
          date: '2020-5-6 12:23',
        },
        {
          exampleName: 'nginx-example-1',
          state: '成功',
          type: '1.9.1',
          creator: 'admin',
          date: '2020-5-6 12:23',
        },
        {
          exampleName: 'nginx-example-1',
          state: '成功',
          type: '1.9.1',
          creator: 'admin',
          date: '2020-5-6 12:23',
        },
      ],
      configCreate: false,
      configEdit: false,
      configAdd: false,
      appInfo: '',
      category: '',
      // 应用信息
      applicationInfos: [],
      chartType: [],
    };
  },

  computed: {
    ...mapState(['space', 'zone', 'user']),
  },
  created() {
    this.getApp();
    this.getChart();
  },
  methods: {
    getApp() {
      AppStoreService.getApp(this.zone.id, this.space.id, this.$route.params.Id).then(res => {
        if (res) {
          this.appInfo = res;
        }
        res.category.forEach(item => {
          if (this.category === '') {
            this.category = item;
          } else {
            this.category = this.category + '、' + item;
          }
        });
      });
    },
    getChart() {
      AppStoreService.getApp(this.zone.id, this.space.id, this.$route.params.Id).then(res => {
        if (res) {
          this.applicationInfos = res.applicationInfos;
        }
        res.applicationInfos.forEach(item => {
          this.chartType.push(item.version);
        });
      });
    },
    linktoForm() {
      this.$router.push({ name: 'appstore.form' });
    },
    linktoYamlForm() {
      this.$router.push({ name: 'appstore.yamlform' });
    },
    // 创建实例，跳转
    creatExample() {
      if (this.selectState === 1) {
        this.$router.push({ name: 'appstore.form' });
      } else if (this.selectState === 2) {
        this.$router.push({ name: 'appstore.yamlform' });
      }
    },
    // 立即创建
    showCreate() {
      this.configCreate = true;
    },
    close() {
      this.configCreate = false;
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },

    selectFirst() {
      this.selectState = 1;
    },
    selectSecond() {
      this.selectState = 2;
    },

    editInfo() {
      this.configEdit = true;
    },
    editClose() {
      this.configEdit = false;
    },

    addEdition() {
      this.configAdd = true;
    },
    addClose() {
      this.configAdd = false;
    },
  },
};
