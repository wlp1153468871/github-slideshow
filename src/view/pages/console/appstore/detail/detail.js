import { mapState } from 'vuex';
import { debounce } from 'lodash';

import AppStoreService from '@/core/services/appstore.service';

import Marked from '@/view/components/marked/marked.vue';

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
      configAdd: false,
      // dialog弹窗
      configCreate: false,
      configDelete: false,
      // 应用信息
      appInfo: '',
      // chart信息
      applicationInfos: [],
      chart: '',
      // 总分类信息
      categories: [],
      stateMap: {
        deployed: 'success',
        failed: 'error',
        timeOut: 'warning',
      },
      loading: {
        instanceTable: false,
      },
      isDestory: true,
      size: 10,
      currentPage: 1,
      total: 0,
      baseUrl: '', // 当前路径
    };
  },

  components: {
    Marked,
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
          }
        });
      },
    },
    size: {
      handler(size) {
        this.instanceTable = this.instanceTableCopy.slice(0, size);
      },
    },
    currentPage: {
      handler(currentPage) {
        this.instanceTable = this.instanceTableCopy.slice((currentPage - 1) * this.size,
          (currentPage) * this.size);
      },
    },
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
    async getApp() {
      AppStoreService.getApp(this.zone.id, this.space.id, this.$route.params.Id).then(res => {
        if (res) {
          this.appInfo = res;
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
            this.getApp();
          }
        });
    },
    // 获取实例列表
    getInstances() {
      this.loading.instanceTable = true;
      AppStoreService.getInstances(this.zone.id, this.space.id, this.$route.params.Id)
        .then(res => {
          if (res) {
            this.instanceTable = res.slice(0, 10);
            this.instanceTableCopy = res;
            this.total = res.length;
            this.instanceNum();
          }
        })
        .finally(() => {
          this.loading.instanceTable = false;
        });
    },
    // 删除某个实例
    deleteInstance(instanceId) {
      if (this.$can('appstoreApplications.appinstance')) {
        AppStoreService.deleteInstance(this.zone.id, this.space.id, this.$route.params.Id, instanceId)
        .then(() => {
          this.$noty.success('实例删除成功');
          this.getInstances();
          this.instanceNum();
        });
      } else {
        this.$noty.error('暂无权限访问');
      }
    },
    // 更新表单
    linktoForm(id) {
      if (this.$can('appstoreApplications.appinstance')) {
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
      } else {
        this.$noty.error('暂无权限访问');
      }
    },
    // 更新yaml
    linktoYamlForm(id) {
      if (this.$can('appstoreApplications.appinstance')) {
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
      } else {
        this.$noty.error('暂无权限访问');
      }
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
      if (this.$can('appstoreAppinstances')) {
        this.$router.push({
          name: 'appstore.instance',
          params: {
            appid: this.appInfo.id,
            instanceid: id,
          },
        });
      } else {
        this.$noty.error('无权限访问');
      }
    },

    // 搜索实例
    updateKey: debounce(function updateKey() {
      this.searchInstance();
    }, 300),
    searchInstance() {
      this.instanceTable = this.instanceTableCopy.filter(item => item.name.includes(this.key))
        .slice((this.currentPage - 1) * this.size, (this.currentPage) * this.size);
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

    addEdition() {
      this.configAdd = true;
    },
    addClose() {
      this.configAdd = false;
    },
    // 获取实例数
    instanceNum() {
      return this.instanceTableCopy.length;
    },

    // 删除文件列表
    removeFile() {
      this.$refs.upload.clearFiles();
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
    changeSize(size) {
      this.size = size;
    },
    handleCurrentChange(page) {
      this.currentPage = page;
    },
  },
};
