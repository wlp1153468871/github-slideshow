import ServiceAdmin from '@/core/services/service-admin.service';
import MarkDown from '@/view/components/markdown/markdown.vue';

export default {
  name: 'AppStoreDetail',
  data() {
    return {
      activeName: 'first',
      // 更新的info
      form: {
        available: 1,
        category: [],
        description: '',
        name: '',
        pictureId: '',
      },
      fileType: ['image/png'],
      fileList: [],
      chartType: ['application/zip', 'application/x-zip', 'application/x-compressed'],
      chartList: [],
      isDisabled: true,
      isShow: true,
      // 分类
      categories: [],
      configEdit: false,
      configAdd: false,
      // 选择状态
      selectStatus: [],
      // 选择的项目
      selectItem: [],
      select: 1,
      status: [
        {
          available: 1,
          value: '已上架',
        },
        {
          available: 0,
          value: '已下架',
        },
      ],
      // 应用信息
      appInfo: '',
      // chart信息
      applicationInfos: '',
      chart: '',
      // 项目组
      orginization: [],
      orgNumber: '',
      // 实例
      instances: [],
    };
  },

  components: {
    MarkDown,
  },

  watch: {
    chart: {
      handler() {
        this.applicationInfos.forEach(item => {
          if (item.version === this.chart) {
            this.appInfo.content = item.content;
          }
        });
      },
    },
    select: {
      handler() {
        if (this.select) {
          this.getAvaOrganizations();
        } else {
          this.getUnavaOrganizations();
        }
      },
    },
  },

  created() {
    this.getApp();
    // 默认上线状态
    this.getAvaOrganizations();
    this.getCategory();
  },

  methods: {
    // 获取应用信息
    getApp() {
      ServiceAdmin.getApp(this.$route.params.id).then(res => {
        if (res) {
          this.appInfo = res;
          this.form.category = res.categoryId;

          const length = `${res.name.split('-').length}`;
          if (res.isGlobal || length < 2) {
            this.form.name = res.name;
          } else {
            this.form.name = `${res.name.split('-')[1]}`;
          }
          this.form.description = res.description;
        }
        this.getCharts();
      });
    },
    // 获取charts信息
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
    // 获取应用分类列表
    getCategory() {
      ServiceAdmin.getCategory().then(res => {
        if (res) {
          this.categories = res;
        }
      });
    },
    // 已上架项目组列表
    getAvaOrganizations() {
      ServiceAdmin.getAvaOrganizations(this.$route.params.id).then(res => {
        if (res) {
          this.orginization = res;
        }
        this.organizationNum();
      });
    },
    // 已下架项目组列表
    getUnavaOrganizations() {
      ServiceAdmin.getUnavaOrganizations(this.$route.params.id).then(res => {
        if (res) {
          this.orginization = res;
        }
        this.organizationNum();
      });
    },
    // 下架一个项目组app
    unavaOrgApp(id) {
      ServiceAdmin.unavaOrgApp(id, this.$route.params.id).then(res => {
        if (res) {
          this.getAvaOrganizations();
          this.$noty.success('下架成功');
        }
      });
    },
    // 上架一个项目在app
    avaOrgApp(id) {
      ServiceAdmin.avaOrgApp(id, this.$route.params.id).then(res => {
        if (res) {
          this.getUnavaOrganizations();
          this.$noty.success('上架成功');
        }
      });
    },

    // 实例列表
    getInstances() {
      ServiceAdmin.getInstances(this.$route.params.id).then(res => {
        if (res) {
          this.instances = res;
        }
      });
    },
    //  更新应用
    updateApp() {
      ServiceAdmin.updateApp(this.$route.params.id, this.form).then(res => {
        if (res) {
          this.$noty.success('修改成功');
          this.editClose();
          this.getApp();
          this.isShow = true;
        }
      });
    },
    // 下架应用
    availableOff() {
      ServiceAdmin.availableOff(this.$route.params.id).then(res => {
        if (res) {
          this.getApp();
          this.$noty.success('应用下架成功');
        }
      });
    },
    // 上架应用
    availableOn() {
      ServiceAdmin.availableOn(this.$route.params.id).then(res => {
        if (res) {
          this.getApp();
          this.$noty.success('应用上架成功');
        }
      });
    },
    // 批量下架
    manyUnava() {
      this.selectItem.forEach(item => {
        this.unavaOrgApp(item.id);
      });
    },
    // 批量上架
    manyAva() {
      this.selectItem.forEach(item => {
        this.avaOrgApp(item.id);
      });
    },
    //  删除应用
    deleteApplication() {
      ServiceAdmin.deleteApplication(this.$route.params.id, this.appInfo.zoneId).then(res => {
        if (res) {
          this.$noty.success('应用删除成功');
          this.$router.push({
            name: 'manage.application',
          });
        }
      });
    },
    // 项目组数
    organizationNum() {
      this.orgNumber = this.orginization.length;
    },
    selectChange(val) {
      const arr = [];
      this.selectItem = val;
      val.forEach(item => {
        if (!arr.includes(item.available)) {
          arr.push(item.available);
        }
      });
      this.selectStatus = arr;
    },
    // 全选
    selectAll(val) {
      const arr = [];
      this.selectItem = val;
      val.forEach(item => {
        if (!arr.includes(item.available)) {
          arr.push(item.available);
        }
      });
      this.selectStatus = arr;
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
      if (this.fileList.length) {
        const file = this.fileList[0];
        ServiceAdmin.uploadPic(file)
          .then(res => {
            this.form.pictureId = res.id;
            this.updateApp();
          })
          .catch(err => {
            this.removeFile();
            this.$noty.error(err);
          });
      } else {
        this.form.pictureId = this.appInfo.pictureId;
        this.updateApp();
      }
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
      ServiceAdmin.uploadFile(this.appInfo.zoneId, this.$route.params.id, formData)
        .then(res => {
          if (res) {
            this.$noty.success('上传chart成功');
            this.getApp();
            this.getCharts();
            this.addClose();
          }
        })
        .catch(err => {
          this.removeFile();
          this.$noty.error(err);
        });
    },

    changeShow() {
      this.isShow = !this.isShow;
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
