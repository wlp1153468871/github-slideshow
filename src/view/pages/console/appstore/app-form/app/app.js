import { mapState } from 'vuex';
import AppStoreService from '@/core/services/appstore.service';

export default {
  name: 'newApp',
  data() {
    return {
      // 分类
      options1: [],
      // 服务类型
      options2: ['Helm Chart'],
      appInfo: '',
      form: {
        appType: 'chart',
        category: [],
        description: '',
        name: '',
        pictureId: '',
      },
      config: {
        visible: false,
      },
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
  },
  methods: {
    // 初始化数据
    init() {
      AppStoreService.getCategory(this.zone.id, this.space.id).then(res => {
        this.options1 = res;
      });
    },

    cancerForm() {
      this.config.visible = true;
    },

    close() {
      this.config.visible = false;
    },
    // 回到上一层
    giveUp() {
      this.$router.go(-1);
    },

    createApp() {
      AppStoreService.create(this.zone.id, this.space.id, this.form).then(res => {
        if (res) {
          this.appInfo = res;
          this.handleUploadChart();
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
          this.createApp();
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
          console.log(res);
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
