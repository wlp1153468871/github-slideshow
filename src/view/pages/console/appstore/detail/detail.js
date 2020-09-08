import { mapState } from 'vuex';
import { debounce } from 'lodash';

import AppStoreService from '@/core/services/appstore.service';
import markdown from '@/view/filters/markdown.filter.js';

export default {
  name: 'AppStoreDetail',

  data() {
    return {
      // 选中状态
      selectState: 0,
      activeName: 'first',
      // 实例列表
      instanceTable: [],
      instanceTableCopy: [],

      key: '',
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
      configDelete: false,
      // 应用信息
      appInfo: '',
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
      //  状态
      stateMap: {
        deployed: 'success',
        failed: 'error',
        timeOut: 'warning',
      },
      loading: {
        instanceTable: false,
      },
      mdHtml: '',
      isDestory: true,
    };
  },

  computed: {
    ...mapState(['space', 'zone', 'user']),
  },

  created() {
    this.activeName = this.$route.query.activeName || 'first';

    this.getApp();
    this.getCategory();
    this.getInstances();
  },

  watch: {
    key: {
      handler() {
        if (this.key === '') {
          this.instanceTable = this.instanceTableCopy;
        } else {
          this.updateKey();
        }
      },
    },
    chart: {
      handler() {
        this.applicationInfos.forEach(item => {
          if (item.version === this.chart) {
            this.appInfo.content = item.content;
            this.mdHtml = markdown(this.appInfo.content);
          }
        });
      },
    },
  },

  methods: {
    stateClass(status) {
      return this.stateMap[status] || '';
    },

    // 获取应用信息
    async getApp() {
      AppStoreService.getApp(this.zone.id, this.space.id, this.$route.params.Id).then(res => {
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
    // 拉取chart信息
    getCharts() {
      AppStoreService.getCharts(this.zone.id, this.space.id, this.$route.params.Id).then(res => {
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
        this.mdHtml = markdown(this.appInfo.content);
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
            this.isShow = true;
          }
        });
    },
    // 获取实例列表
    getInstances() {
      this.loading.instanceTable = true;
      AppStoreService.getInstances(this.zone.id, this.space.id, this.$route.params.Id)
        .then(res => {
          if (res) {
            this.instanceTable = res;
            this.instanceTableCopy = res;
            this.instanceNum();
          }
        })
        .finally(() => {
          this.loading.instanceTable = false;
        });
    },
    // 删除某个实例
    deleteInstance(instanceId) {
      AppStoreService.deleteInstance(this.zone.id, this.space.id, this.$route.params.Id, instanceId)
        .then(res => {
          if (res) {
            this.$noty.success('实例删除成功');
            this.getInstances();
            this.instanceNum();
          } else {
            this.$noty.error('实例删除失败');
          }
        });
    },
    changeShow() {
      this.isShow = !this.isShow;
    },
    // 更新表单
    linktoForm(id) {
      this.$router.push({
        name: 'appstore.form',
        params: {
          appid: this.appInfo.id,
          version: this.chart,
        },
        query: {
          instanceId: id,
        },
      });
    },
    // 更新yaml
    linktoYamlForm(id) {
      this.$router.push({
        name: 'appstore.yamlform',
        params: {
          appid: this.appInfo.id,
          version: this.chart,
        },
        query: {
          instanceId: id,
        },
      });
    },
    destoryDialog() {
      if (this.selectState === 1) {
        this.$router.push({
          name: 'appstore.form',
          params: {
            appid: this.appInfo.id,
            version: this.chart,
          },
          query: {
            activeName: this.activeName,
          },
        });
      } else if (this.selectState === 2) {
        this.$router.push({
          name: 'appstore.yamlform',
          params: {
            appid: this.appInfo.id,
            version: this.chart,
          },
          query: {
            activeName: this.activeName,
          },
        });
      }
    },
    // 创建实例，跳转
    creatExample() {
      if (this.selectState === 0) {
        this.$noty.warning('请选择创建方式');
      } else {
        this.configCreate = false;
      }
      // if (this.selectState === 1) {
      //   this.configCreate = false;
      //   this.$router.push({
      //     name: 'appstore.form',
      //     params: {
      //       appid: this.appInfo.id,
      //       version: this.chart,
      //     },
      //   });
      // } else if (this.selectState === 2) {
      //   this.configCreate = false;
      //   this.$router.push({
      //     name: 'appstore.yamlform',
      //     params: {
      //       appid: this.appInfo.id,
      //       version: this.chart,
      //     },
      //   });
      // } else {
      //   this.$noty.warning('请选择创建方式');
      // }
    },
    // 删除chart版本
    deleteChart(version) {
      console.log(this.applicationInfos);
      this.applicationInfos.forEach((item, index) => {
        if (item.version === version) {
          this.applicationInfos.splice(index, 1);
        }
      });
    },
    // 实例跳转
    rowClick(id) {
      this.$router.push({
        name: 'appstore.instance',
        params: {
          appid: this.appInfo.id,
          instanceid: id,
        },
      });
    },

    // 搜索实例
    updateKey: debounce(function updateKey() {
      this.searchInstance();
    }, 300),
    searchInstance() {
      this.instanceTable = this.instanceTableCopy.filter(item => item.name.includes(this.key));
    },

    // 刷新
    fresh() {
      this.key = '';
      this.getInstances();
    },
    // 立即创建
    showCreate() {
      this.configCreate = true;
    },
    // 立即删除
    showDelete() {
      this.configDelete = true;
    },
    closeCreate() {
      this.selectState = 0;
      this.configCreate = false;
    },
    closeDelete() {
      this.configDelete = false;
    },
    // 选中form
    selectFirst() {
      this.selectState = 1;
    },
    // 选中yaml
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
    // 获取实例数
    instanceNum() {
      return this.instanceTable.length;
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
        AppStoreService.uploadPic(file)
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
      AppStoreService.uploadFile(this.zone.id, this.space.id, this.appInfo.id, formData)
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
  },
};
