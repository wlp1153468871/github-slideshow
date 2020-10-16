import ServiceAdmin from '@/core/services/service-admin.service';

import Marked from '@/view/components/marked/marked.vue';

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
      // 实例
      instances: [],
      instancesCopy: [],
      key: '',
      instanceKey: '',
      //  状态
      stateMap: {
        deployed: 'success',
        failed: 'error',
        timeOut: 'warning',
      },
      //  懒加载
      loading: {
        onLine: false,
        instance: false,
      },
      size: 10,
      currentPage: 1,
      total: 0,
    };
  },

  components: {
    Marked,
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
    size: {
      handler(size) {
        this.instances = this.instancesCopy.slice(0, size);
      },
    },
    currentPage: {
      handler(currentPage) {
        this.instances = this.instancesCopy.slice((currentPage - 1) * this.size,
          (currentPage) * this.size);
      },
    },
  },

  created() {
    this.getApp();
    // 默认上线状态
    this.getCategory();
    this.getInstances();
  },

  methods: {
    // 拼接url
    getUrl(url) {
      const local = window.location;
      if (process.env.NODE_ENV === 'development') {
        return `${process.env.VUE_APP_API_URL}${url}`;
      }
      return `${local.origin}${url}`;
    },
    stateClass(status) {
      return this.stateMap[status] || '';
    },
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

    // 实例列表
    getInstances() {
      this.loading.instance = true;
      ServiceAdmin.getInstances(this.$route.params.id)
        .then(res => {
          if (res) {
            this.instances = res.slice(0, 10);
            this.instancesCopy = res;
            this.total = res.length;
          }
        })
        .finally(() => {
          this.loading.instance = false;
        });
    },
    // 实例数
    instancesNum() {
      return this.instances.length;
    },
    searchInstance(val) {
      this.instances = this.instancesCopy.filter(item => item.name.includes(val));
    },
    // 刷新
    freshInstance() {
      this.instanceKey = '';
      this.getInstances();
    },
    //  更新应用
    updateApp() {
      if (this.form.pictureId == 0) {
        this.$noty.error('应用图标不能为空');
      } else if (this.form.description.length > 200) {
        this.$noty.error('描述字符长度不能大于200');
      } else {
        ServiceAdmin.updateApp(this.$route.params.id, this.form).then(res => {
          if (res) {
            this.$noty.success('修改成功');
            this.editClose();
            this.getApp();
            this.isShow = true;
          }
        });
      }
    },
    // 下架应用
    availableOff() {
      ServiceAdmin.availableOff(this.$route.params.id).then(res => {
        if (res) {
          this.getApp();
          this.$noty.success('应用禁用成功');
        }
      });
    },
    // 上架应用
    availableOn() {
      ServiceAdmin.availableOn(this.$route.params.id).then(res => {
        if (res) {
          this.getApp();
          this.$noty.success('应用启用成功');
        }
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
        this.fileList = [];
        this.fileList = [...this.fileList, file];
        this.isDisabled = false;
      }
      return false;
    },

    // 删除文件列表
    removeFile() {
      this.$refs.upload.clearFiles();
    },
    // 租户
    linkOrg(id) {
      this.$router.push({
        name: 'manage.org.detail',
        params: {
          org: id,
        },
      });
    },
    // 项目组
    linkSpace(orgId, spaceId) {
      this.$router.push({
        name: 'manage.org.space',
        params: {
          org: orgId,
          space: spaceId,
        },
      });
    },
    //  实例
    // linkInstance(appid, instanceid) {
    //   this.$router.push({
    //     name: 'application.instance',
    //     params: {
    //       appid,
    //       instanceid,
    //     },
    //   });
    // },
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
        // this.form.pictureId = this.appInfo.pictureId;
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
        this.chartList = [];
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
        .catch(() => {
          this.removeFile();
        })
        .finally(() => {
          this.chartList = [];
        });
    },

    changeShow(val) {
      this.fileList = [];
      this.form.pictureId = val;
      this.isShow = !this.isShow;
    },
    editInfo() {
      this.isShow = true;
      this.configEdit = true;
      this.getApp();
    },
    editClose() {
      this.configEdit = false;
    },
    addEdition() {
      this.configAdd = true;
    },
    addClose() {
      this.configAdd = false;
      this.chartList = [];
    },
    // 分页
    changeSize(size) {
      this.size = size;
    },
    handleCurrentChange(page) {
      this.currentPage = page;
    },
  },
};
