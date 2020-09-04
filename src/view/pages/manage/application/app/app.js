import { mapState } from 'vuex';

import AppStoreService from '@/core/services/appstore.service';
import ZoneAdminService from '@/core/services/zone-admin.service';

export default {
  name: 'createApp',
  data() {
    return {
      // 分类
      categories: [],
      // 服务类型
      appTypes: ['Helm Chart'],
      appInfo: '',
      form: {
        appType: '',
        category: [],
        description: '',
        name: '',
        pictureId: '',
      },
      version: '', // 版本
      zoneId: '', // 可用区ID
      zoneList: [], // 可用区列表
      config: {
        visible: false,
      },
      categoryConfig: {
        showAddCategory: false,
        header: {
          title: '新增分类',
          showClose: true,
        },
      },
      categoryName: '', // 新增分类的名称
      fileType: ['image/png'],
      fileList: [],
      chartType: ['application/zip', 'application/x-zip', 'application/x-compressed'],
      chartList: [],
      isDisabled: true,
    };
  },
  computed: {
    ...mapState(['space', 'zone', 'user']),
  },
  created() {
    this.init();
    this.getAllZones();
  },
  methods: {
    /**
     * 新增分类按钮被点击
     */
    addCategory() {
      this.categoryConfig.showAddCategory = true;
    },
    /**
     * 新增分类提交
     */
    submit() {
      ZoneAdminService.addCategory(this.categoryName).then(res => {
        this.categories.push(res);
      });
    },
    /**
     * 列出所有可用区
     */
    getAllZones() {
      this.zoneList = [];
      ZoneAdminService.getzoneList().then(res => {
        res.forEach(item => {
          const obj = {
            id: item.id,
            name: item.name,
          };
          this.zoneList.push(obj);
        });
      });
    },
    // 初始化数据
    init() {
      AppStoreService.getCategory(this.zone.id, this.space.id).then(res => {
        this.categories = res;
      });
    },

    cancerForm() {
      this.config.visible = true;
    },

    cancel() {
      this.config.visible = true;
    },

    close() {
      this.config.visible = false;
    },
    // 回到上一层
    giveUp() {
      if (this.chartList.length !== 0) {
        this.removeChart();
      }
      this.$router.go(-1);
    },

    createApp() {
      if (this.chartList.length === 0) {
        this.$noty.error('chart文件不能为空');
        return;
      } else if (this.zoneId === '') {
        this.$noty.error('可用区不能为空');
        return;
      } else if (this.form.name === '') {
        this.$noty.error('模板名称不能为空');
        return;
      } else if (this.form.appType === '') {
        this.$noty.error('服务类型不能为空');
        return;
      } else if (this.form.category.length === 0) {
        this.$noty.error('分类不能为空');
        return;
      }
      ZoneAdminService.createApplication(this.zoneId, this.form).then(res => {
        if (res) {
          this.$noty.success('创建成功');
          this.$router.back();
        }
      });
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
        this.handleUpload();
      }
      return false;
    },

    // 删除文件列表
    removeFile() {
      this.$refs.upload.clearFiles();
    },

    /**
     * 删除chart文件
     */
    removeChart() {
      if (this.zoneId !== '') {
        ZoneAdminService.deleteChartVersion(this.zoneId, this.form.name, this.version).then(() => {
          this.chartList = [];
          this.form.name = '';
          this.form.description = '';
        });
      }
    },

    // 上传图片文件
    handleUpload() {
      this.isDisabled = true;
      if (this.fileList.length) {
        const file = this.fileList[0];
        AppStoreService.uploadPic(file)
          .then(res => {
            this.form.pictureId = res.id;
          })
          .catch(() => {
            this.removeFile();
            this.$noty.error('图片上传失败或未上传图片');
          });
      } else {
        // this.createApp();
      }
    },


    // 上传chart文件之前
    beforeUploadChart(file) {
      if (this.zoneId === '') {
        this.$noty.error('请先选择可用区');
        return false;
      } else if (this.chartType.indexOf(file.type) < 0) {z
        console.log(`文件MIME: ${file.type}`);
        this.$noty.warning('请选择正确的压缩格式文件');
      } else {
        this.chartList = [];
        this.chartList = [...this.chartList, file];
      }
      return true;
    },

    // 上传chart文件
    handleUploadChart() {
      console.log(this.zoneId);
      if (this.zoneId === '') {
        return;
      }
      const formData = new FormData();
      this.chartList.forEach(file => {
        formData.append('chart', file);
      });
      ZoneAdminService.createChart(this.zoneId, formData)
        .then(res => {
          if (res) {
            this.form.name = res.chartName;
            this.form.description = res.description;
            this.version = res.version;
          }
        })
        .catch(() => {
          this.chartList = [];
          this.$noty.error('创建失败');
        });
    },
  },
};
