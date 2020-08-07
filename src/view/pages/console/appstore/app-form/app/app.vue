<template>
  <div class="app">
    <div class="layout-content-header form-header">
      <span @click="cancerForm">
        <svg class="icon" style="color: #217EF2;">
          <use :xlink:href="`#icon_close`"></use>
        </svg>
      </span>
      <dao-dialog
        :visible.sync="config.visible"
        header="确认是否放弃编辑"
        :footer="config.footer"
      >
        <div class="body">确认是否放弃当前编辑，放弃后不可撤销。</div>
        <div slot="footer">
          <button class="dao-btn red" @click="giveUp">放弃</button>
          <button class="dao-btn" @click="close">取消</button>
        </div>
      </dao-dialog>
      <span class="form-title">
        新建应用
      </span>
    </div>
    <dao-setting-layout class="basic-info">
      <div class="dao-setting-section">
        <div class="dao-setting-title title-text">基本信息</div>
      </div>
      <div class="dao-setting-item" style="height: 42px;">
        <div class="dao-setting-label dao-name">自定义名称</div>
        <div class="dao-setting-content">
          <dao-input
            block
            v-model="form.name"
            style="width: 98%"
            placeholder="请输入自定义名称">
          </dao-input>
        </div>
      </div>
      <div class="dao-setting-section">
        <div class="dao-setting-item">
          <div class="dao-setting-label dao-name">应用图标</div>
          <div class="dao-setting-content">
            <div class="desc">建议大小120 像素 x 120 像素，支持 PNG，文件小于 1 MB</div>
            <el-upload
              class="upload-demo"
              ref="upload"
              action="#"
              :http-request="handleUpload"
              :file-list="fileList"
              accept="image/png"
              :limit="1"
              :before-upload="beforeUpload"
              :on-remove="removeFile">
              <button class="dao-btn blue">上传图标</button>
            </el-upload>
          </div>
        </div>
      </div>
      <div class="dao-setting-section">
        <div class="dao-setting-item">
          <div class="dao-setting-label dao-name">服务类型</div>
          <div class="dao-setting-content">
            <dao-select
              v-model="form.appType"
              class="dao-option"
              size="sm"
              style="width: 780px;height: 32px;"
              placeholder="选择服务类型"
            >
              <dao-option
                v-for="item in items"
                :key="item.value"
                :value="item.value"
                :label="item.text">
              </dao-option>
            </dao-select>
          </div>
        </div>
      </div>
      <div class="dao-setting-section">
        <div class="dao-setting-item">
          <div class="dao-setting-label dao-name">分类</div>
          <div class="dao-setting-content">
            <dao-select
              v-model="form.category"
              class="dao-option"
              size="sm"
              style="width: 780px;height: 32px;"
              placeholder="选择分类"
            >
              <dao-option
                v-for="item in items"
                :key="item.value"
                :value="item.value"
                :label="item.text">
              </dao-option>
            </dao-select>
          </div>
        </div>
      </div>
      <div class="dao-setting-section">
        <div class="dao-setting-item">
          <div class="dao-setting-label dao-name">描述</div>
          <div class="dao-setting-content">
            <textarea
              class="dao-control"
              type="text"
              placeholder="添加描述"
              rows="2"
              v-model="form.description"
              style="width: 780px;"
            >
            </textarea>
          </div>
        </div>
      </div>
    </dao-setting-layout>
    <dao-setting-layout class="basic-info">
      <div class="dao-setting-section">
        <div class="dao-setting-title title-text">Chart 文件</div>
      </div>
      <div class="dao-setting-item" style="height: 42px;">
        <div class="dao-setting-label dao-name">Chart 文件</div>
        <div class="dao-setting-content">
            <el-upload
              class="upload-demo"
              ref="upload"
              action="#"
              :http-request="handleUploadChart"
              :file-list="chartList"
              accept="application/zip, application/x-compressed, application/x-gzip"
              :limit="1"
              :before-upload="beforeUploadChart"
              :on-remove="removeFile">
              <button class="dao-btn blue">上传chart</button>
            </el-upload>
        </div>
      </div>
    </dao-setting-layout>
    <div class="dao-setting-layout-footer footer-lay">
      <div class="btn-layout">
        <button class="dao-btn">取消</button>
        <button class="dao-btn blue" @click="handleUpload">确认创建</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AppStoreService from '@/core/services/appstore.service';

export default {
  name: 'newApp',
  data() {
    return {
      appInfo: '',
      form: {
        appType: '',
        category: ['0', '1'],
        description: '',
        name: '',
        pictureId: '',
      },
      appTypes: [],
      items: [
        {
          text: '默认租户',
          value: '默认租户',
        },
        {
          text: '租户1',
          value: '租户1',
        },
      ],
      config: {
        visible: false,
        footer: {
          cancelText: '取消',
          confirmText: '放弃',
          confirmDisabled: true,
        },
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
    // this.init();
  },
  methods: {
    // init() {

    // },
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
        this.$message.warning('请选择.png格式文件');
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

    // 文件上传检查
    checkFile() {
      if (this.fileList.length > 0) {
        this.$message.warning('请上传文件后在提交');
      }
    },

    // 上传文件
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
        this.$message.warning('请选择正确的压缩格式文件');
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
        console.log(file);
        formData.append('chart', file);
      });
      AppStoreService.uploadFile(this.zone.id, this.space.id, this.appInfo.id, formData)
        .then(() => {
          this.$message.success('应用创建成功');
          this.$router.push({
            name: 'console.appstore',
          });
        })
        .catch(err => {
          this.removeFile();
          this.$message.error(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.app{
  .form-header {
    height: 52px;
    .body {
      padding: 20px;
    }
    .form-title {
      margin-left: 20px;
      height: 16px;
      line-height: 32px;
      font-size: 16px;
      font-weight: 500;
      color: #3D444F;
    }
  }
  .basic-info {
    margin: 20px 160px 0 160px;
    .title-text {
      font-size: 14px;
      font-family: SFProText-Semibold,SFProText;
      font-weight: 600;
      color: #3D444F;
    }
    .dao-name {
      height: 14px;
      line-height: 14px;
      font-family: SFProText-Regular,SFProText;
      font-weight: 400;
      color:#3D444F;
    }
    .desc {
      height: 14px;
      font-size: 12px;
      font-family: PingFangSC-Regular,PingFang SC;
      font-weight: 400;
      color: #3D444F;
      line-height: 14px;
    }
  }
  .footer-lay {
    position: relative;
    overflow: hidden;
    height: 50px;
    margin: 20px 0 0 0;
    .btn-layout {
      position: absolute;
      bottom: 10px;
      right: 20px;
    }
  }
}
</style>
