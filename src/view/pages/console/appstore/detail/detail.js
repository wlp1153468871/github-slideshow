import { mapState } from 'vuex';

import AppStoreService from '@/core/services/appstore.service';

export default {
  name: 'AppStoreDetail',

  data() {
    return {
      // 选中状态
      selectState: 0,
      activeName: 'first',
      instanceTable: [],

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
    this.getCategory();
    this.getInstances();
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
        }
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
          if (res) {
            this.$noty.success('修改成功');
            this.editClose();
            this.getApp();
          }
        });
    },
    // 获取实例列表
    getInstances() {
      AppStoreService.getInstances(this.zone.id, this.space.id, this.$route.params.Id).then(res => {
        if (res) {
          this.instanceTable = res;

          // res.forEach(item => {
          //   const date = item.created_at;
          //   console.log(date);
          //   const Y = date.getFullYear() + '-';
          //   const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
          //   const D = date.getDate() + ' ';
          //   const h = date.getHours() + ':';
          //   const m = date.getMinutes() + ':';
          //   const s = date.getSeconds();
          //   console.log(Y+M+D+h+m+s);
          // });
        }
      });
    },
    // 删除某个实例
    deleteInstance(instanceId) {
      AppStoreService.deleteInstance(this.zone.id, this.space.id, this.$route.params.Id, instanceId)
        .then(() => {
          this.$noty.success('实例删除成功');
          this.getInstances();
        });
    },
    changeShow() {
      this.isShow = !this.isShow;
    },
    linktoForm() {
      this.$router.push({
        name: 'appstore.form',
        params: {
          appid: this.appInfo.id,
          version: this.chart,
        },
      });
    },
    linktoYamlForm(id) {
      this.$router.push({
        name: 'appstore.yamlform',
        params: {
          appid: this.appInfo.id,
          version: this.chart,
        },
      });
      console.log(id);
    },
    // 创建实例，跳转
    creatExample() {
      if (this.selectState === 1) {
        this.$router.push({
          name: 'appstore.form',
          params: {
            appid: this.appInfo.id,
            version: this.chart,
          },
        });
      } else if (this.selectState === 2) {
        this.$router.push({
          name: 'appstore.yamlform',
          params: {
            appid: this.appInfo.id,
            version: this.chart,
          },
        });
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

    removeTag(res) {
      this.form.category = res;
      // console.log(this.form.category);
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
          this.updateApp();
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
            this.$noty.success('上传chart成功');
          }
        })
        .catch(err => {
          this.removeFile();
          this.$noty.error(err);
        });
    },
  },
};
