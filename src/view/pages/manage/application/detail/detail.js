import { mapState } from 'vuex';

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
      // 实例
      instances: [],
    };
  },

  computed: {
    ...mapState(['space', 'zone']),
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
  },

  created() {
    this.getApp();
    this.getOrganizations();
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
    // 项目组列表
    getOrganizations() {
      ServiceAdmin.getOrganizations(this.$route.params.id).then(res => {
        if (res) {
          this.orginization = res;
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
    selectChange(val) {
      const arr = [];
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
