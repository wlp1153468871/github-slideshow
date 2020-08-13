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

      fileType: ['image/png'],
      fileList: [],
      chartType: ['application/zip', 'application/x-zip', 'application/x-compressed'],
      chartList: [],
      isDisabled: true,
      isShow: true,

      // dialog弹窗
      configCreate: false,
      configEdit: false,
      configAdd: false,
      // 应用信息
      appInfo: '',
      category: '',
      // chart信息
      applicationInfos: [],
      chart: '',
      // 总分类信息
      categories: [],
      // 更新的info
      form: {
        available: 1,
        category: [],
        description: '',
        name: '',
        pictureId: '',
      },
    };
  },

  computed: {
    ...mapState(['space', 'zone']),
  },
  created() {
    this.getApp();
    this.getChart();
    // this.getInstances();
    this.getCategory();
  },
  methods: {
    // 获取应用信息
    async getApp() {
      AppStoreService.getApp(this.zone.id, this.space.id, this.$route.params.Id).then(res => {
        if (res) {
          this.appInfo = res;

          this.form.category = res.category;
          this.form.name = res.name.split('-')[1];
          this.form.description = res.description;
          this.form.pictureId = res.pictureId;
        }
        console.log(this.form);
      });
    },
    // 获取chart
    getChart() {
      AppStoreService.getApp(this.zone.id, this.space.id, this.$route.params.Id).then(res => {
        if (res) {
          this.applicationInfos = res.applicationInfos;
        }
        res.applicationInfos.forEach(item => {
          this.chart = item.version;
        });
      });
    },
    // 获取分类列表
    getCategory() {
      AppStoreService.getCategory(this.zone.id, this.space.id).then(res => {
        if (res) {
          this.categories = res;
        }
      });
    },
    // 删除应用
    deleteApp() {
      AppStoreService.deleteApp(this.zone.id, this.space.id, this.$route.params.Id).then(() => {
        this.$noty.success('应用删除成功');
        this.$router.push({
          name: 'console.appstore',
        });
      });
    },
    // 更新应用信息
    updateApp() {
      AppStoreService.updateApp(this.zone.id, this.space.id, this.$route.params.Id, this.form)
        .then(res => {
          console.log(res);
          this.$noty.success('修改成功');
          this.$router.go(0);
        });
    },
    // 获取实例列表
    getInstances() {
      AppStoreService.getInstances(this.zone.id, this.space.id, this.$route.params.Id).then(res => {
        console.log(res);
      });
    },
    // 获取yaml
    getYaml() {
      AppStoreService.getYaml(this.zone.id, this.space.id, this.$route.params.Id).then(res => {
        console.log(res);
      });
    },

    changeShow() {
      this.isShow = !this.isShow;
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


    // 上传文件之前
    beforeUpload(file) {
      if (this.fileType.indexOf(file.type) < 0) {
        console.log(`文件MIME: ${file.type}`);
        this.$noty.warning('请选择.png格式文件');
        this.removeFile();
      } else {
        this.fileList = [...this.fileList, file];
        this.isDisabled = false;
      }
      return false;
    },

    // 删除文件列表
    removeFile() {
      this.$refs.upload.clearFiles();
    },

    // 上传图片文件
    handleUpload() {
      this.isDisabled = true;
      const formData = new FormData();
      this.fileList.forEach(file => {
        formData.append('blob', file);
      });
      AppStoreService.uploadImg(formData)
        .then(res => {
          this.form.pictureId = res.id;
        })
        .catch(err => {
          this.removeFile();
          this.$message.error(err);
        });
    },
    // 上传chart文件之前
    beforeUploadChart(file) {
      if (this.chartType.indexOf(file.type) < 0) {
        console.log(`文件MIME: ${file.type}`);
        this.$noty.warning('请选择正确的压缩格式文件');
        this.removeFile();
      } else {
        this.chartList = [...this.chartList, file];
      }
      return false;
    },

    // 上传chart文件
    handleUploadChart() {
      const formData = new FormData();
      this.chartList.forEach(file => {
        formData.append('chart', file);
      });
      AppStoreService.uploadFile(this.zone.id, this.space.id, this.appInfo.id, formData)
        .then(res => {
          if (res) {
            this.$noty.success('应用创建成功');
            this.$router.push({
              name: 'console.appstore',
            });
          }
        })
        .catch(err => {
          this.removeFile();
          this.$noty.error(err);
        });
    },
  },
};
