<template>
  <div class="new-app">
    <div class="newApp-nav">
      <span style="color: #217EF2;font-size: 25px;cursor: pointer" @click="cancer">×</span>
      <span>新建应用模板</span>
      <dao-dialog
        :visible.sync="visibleForm"
        header="确认是否放弃编辑"
        @before-close="destoryDialog"
      >
        <div class="body">确认是否放弃当前编辑，放弃后不可撤销。</div>
        <div slot="footer">
          <button class="dao-btn red" @click="handleBack">放弃</button>
          <button class="dao-btn" @click="giveUp">取消</button>
        </div>
      </dao-dialog>
    </div>
    <!--    chartw文件-->
    <div class="newApp-box chart-file" id="chart-file">
      <dao-setting-layout>
        <template slot="layout-title">
          <div class="base-info">Chart文件</div>
        </template>
        <dao-setting-section>
          <template slot="label">chart文件</template>
          <template slot="content">
            <el-upload
              class="upload-demo"
              ref="uploadChart"
              action="#"
              :http-request="handleUploadChart"
              :file-list="chartList"
              accept="application/zip, application/x-compressed,
              application/x-gzip, application/gzip, application/x-tar"
              :limit="1"
              :before-upload="beforeUploadChart"
              :on-remove="removeFileChart"
            >
              <button class="dao-btn blue">上传chart</button>
            </el-upload>
          </template>
        </dao-setting-section>
      </dao-setting-layout>
    </div>
    <div class="newApp-box">
      <dao-setting-layout>
        <template slot="layout-title">
          <div class="base-info">基本信息</div>
        </template>
        <dao-setting-section>
          <template slot="label">模板名称</template>
          <template slot="content">
            <dao-input
              readonly
              style="width: 100%"
              v-model="name"
              block
              placeholder="请上传chart版本"></dao-input>
          </template>
        </dao-setting-section>
        <dao-setting-section>
          <template slot="label">模板图标</template>
          <template slot="content">
            <div class="content-text">建议大小120像素×120像素，支持PNG，文件小于1MB</div>
          </template>
          <template slot="content">
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
          </template>
        </dao-setting-section>
        <dao-setting-section>
          <template slot="label">是否认证</template>
          <template slot="content">
            <el-radio-group v-model="daoAuth">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </template>
        </dao-setting-section>
        <dao-setting-section>
          <template slot="label">服务类型</template>
          <template slot="content">
            <dao-select
              v-model="appType"
              placeholder="选择服务类型">
              <dao-option
                v-for="item in options"
                :key="item.value"
                :value="item.value"
                :label="item.text">
              </dao-option>
            </dao-select>
          </template>
        </dao-setting-section>
        <dao-setting-section>
          <template slot="label">分类</template>
          <template slot="content">
            <svg class="icon" @click="addCategory">
              <use :xlink:href="`#icon_plus-circled`"></use>
            </svg>
            <el-select
              class="category-style"
              v-model="category"
              placeholder="选择分类"
              @change="handleCategory"
              :multiple="true">
              <el-option
                v-for="item in classification"
                :key="item.id"
                :value="item.id"
                :label="item.name">
              </el-option>
            </el-select>
          </template>
        </dao-setting-section>
<!--        新增分类弹窗-->
        <div v-if="config.showAddCategory">
          <div class="dao-dialog demo2">
            <dao-dialog
              :visible.sync="config.showAddCategory"
              :header="config.header"
              @confirm="submit"
              @cancel="cancel">
              <dao-setting-layout>
                <dao-setting-section>
                  <template slot="label">分类名称</template>
                  <template slot="content">
                    <dao-input
                      v-model="categoryName"
                      placeholder="请输入分类名称">
                    </dao-input>
                  </template>
                </dao-setting-section>
              </dao-setting-layout>
            </dao-dialog>
          </div>
        </div>
        <dao-setting-section>
          <template slot="label">描述</template>
          <template slot="content">
            <textarea
              class="dao-control"
              type="text"
              rows="2"
              placeholder="请填写内容" v-model="description">
            </textarea>
          </template>
        </dao-setting-section>
      </dao-setting-layout>
    </div>
<!--    底部取消-->
    <div class="footer">
      <div class="btn-style">
        <button class="dao-btn" @click="cancer">取消</button>
        <button class="dao-btn blue" @click="createApp">确认创建</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Space from '@/view/pages/manage/org/org-detail/panels/space';
import DaoSettingSection from '@/view/components/daox/setting-layout/setting-section';
import AppStoreService from '@/core/services/appstore.service';
import ZoneAdminService from '@/core/services/zone-admin.service';

export default {
  name: 'new-app',
  components: { DaoSettingSection, Space },
  data() {
    const id = `${this.$route.params.id}`;
    return {
      id,
      appName: '', // 应用名称
      isWidthLimit: false,
      appType: '', // 服务类型
      fileList: [], // 上传图标
      options: [{
        text: 'Helm Chart',
        value: 'Helm Chart',
      }],
      category: [], // 分类
      classification: [{
        text: 'Helm Chart',
        value: 1,
      }, {
        text: 'Helm Chart',
        value: 2,
      }],
      name: '', // 应用名称
      description: '', // 描述,
      pictureId: '', // 上传图标的id
      daoAuth: false, // 是否上传
      fileType: ['image/png'],
      chartType: ['application/zip', 'application/x-zip', 'application/x-compressed', 'application/x-tar', 'application/gzip', 'application/x-gzip'],
      chartList: [],
      showAddCategory: false, // 控制新增分类按钮
      // 弹窗所需数据
      config: {
        showAddCategory: false,
        header: {
          title: '新增分类',
          showClose: true,
        },
      },
      categoryName: '', // 新增分类名称
      version: '', // 版本
      visibleForm: false,
      giveup: false,
    };
  },
  created() {
    this.getCategoryList();
  },
  computed: {
    ...mapState(['space', 'zone', 'user']),
  },
  methods: {
    /**
     * 新增分类按钮被点击
     */
    addCategory() {
      this.config.showAddCategory = true;
    },
    /**
     * 新增分类提交
     */
    submit() {
      ZoneAdminService.addCategory(this.categoryName).then(res => {
        this.classification.push(res);
        this.$noty.success('新增分类成功');
      });
      this.categoryName = '';
      this.config.showAddCategory = false;
    },
    /**
     * 取消新增
     */
    cancel() {
      this.categoryName = '';
      this.config.showAddCategory = false;
    },
    /**
     * 分类改变回调函数
     */
    handleCategory(val) {
      console.log(val);
    },
    /**
     * 获取分类列表
     */
    getCategoryList() {
      ZoneAdminService.getCategoryList().then(res => {
        this.classification = res;
      });
    },
    cancer() {
      this.visibleForm = true;
    },
    destoryDialog() {
      if (this.giveup) {
        this.$router.back();
      }
    },
    giveUp() {
      if (this.chartList.length !== 0) {
        this.removeFileChart();
      }
      this.visibleForm = false;
    },
    handleBack() {
      if (this.chartList.length) {
        this.removeFileChart();
      }
      this.giveup = true;
      this.visibleForm = false;
    },
    /**
     * 文件上传之前的回调函数
     * @param file
     * @returns {boolean}
     */
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
    /**
     * 删除文件
     */
    removeFile() {
      this.$refs.upload.clearFiles();
    },
    /**
     * 删除chart文件
     */
    removeFileChart() {
      ZoneAdminService.deleteChartVersion(this.id, undefined, this.name, this.version).then(() => {
        this.chartList = [];
        this.name = '';
        this.description = '';
        this.$noty.success('chart文件删除');
      });
    },
    createApp() {
      if (this.pictureId === '') {
        this.$noty.error('模板图标为必传');
        return;
      } else if (this.appType === '') {
        this.$noty.error('服务类型不能为空');
        return;
      } else if (this.category.length === 0) {
        this.$noty.error('分类不能为空');
        return;
      }
      const formData = {
        name: this.name,
        pictureId: this.pictureId,
        appType: this.appType,
        category: this.category,
        description: this.description,
        daoAuth: this.daoAuth,
      };
      ZoneAdminService.createApplication(this.id, formData).then(res => {
        if (res) {
          this.$router.back();
          this.$noty.success('创建成功');
        }
      });
    },

    /**
     * 图片文件上传
     */
    handleUpload() {
      this.isDisabled = true;
      const file = this.fileList[0];
      AppStoreService.uploadPic(file)
        .then(res => {
          this.pictureId = res.id;
          // this.createApp();
        })
        .catch(err => {
          this.removeFile();
          this.$message.error(err);
        });
    },

    /**
     * chart文件上传之前的回调函数
     */
    beforeUploadChart(file) {
      console.log(file, file.type, '文件类型');
      if (this.chartType.indexOf(file.type) < 0) {
        console.log(`文件MIME: ${file.type}`);
        this.$noty.warning('请选择正确的压缩格式文件');
      } else {
        this.chartList = [];
        this.chartList = [...this.chartList, file];
        this.isDisabled = false;
      }
      return true;
    },

    /**
     * chart文件上传回调函数
     */
    handleUploadChart() {
      const formData = new FormData();
      this.chartList.forEach(file => {
        formData.append('chart', file);
      });
      console.log(formData, '文件内容');
      ZoneAdminService.createChart(this.id, formData)
        .then(res => {
          if (res) {
            this.name = res.chartName;
            this.description = res.description;
            this.version = res.version;
          }
          this.$noty.success('chart上传成功');
        })
        .catch(() => {
          this.chartList = [];
          this.$noty.error('创建失败');
        });
    },
  },
};
</script>

<style>
  .newApp-box .dao-setting-layout {
    border: none;
    box-shadow: none;
  }
  .newApp-box .daox-setting-layout-header {
    border-bottom: 1px solid #E3E7EE;
  }
  .newApp-box .dao-select {
    width: 100%;
  }
</style>
<style lang="scss" scoped>
.new-app {
  /*min-height: 100vh;*/
  min-height: 915px;
  background-color: #F1F3F6;
  border: 1px solid #F1F3F6;
  .newApp-nav {
    position: fixed;
    background-color: #fff;
    line-height: 51px;
    width: 100%;
    font-weight: 700;
    font-size: 16px;
    z-index: 999;
    /*top: -1px;*/
    span {
      margin-left: 20px;
    }
    .body {
      padding: 20px;
    }
  }
  .newApp-box {
    box-sizing: border-box;
    width: 80%;
    background-color: #fff;
    margin: 20px auto 60px auto;
    .base-info {
      width: 100%;
      margin-left: 20px;
      font-weight: 700;
      font-size: 16px;
      padding: 10px 0px;
    }
  }
  .content-text {
    font-size: 12px;
  }
  .dao-control {
    width: 100%;
  }
  #chart-file {
    margin-top: 70px;
    /*margin-bottom: 70px;*/
  }
  .footer {
    height: 55px;
    background-color: #fff;
    z-index: 999;
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .btn-style {
      margin-right: 30px;
    }
  }
  .category-style {
    width: 95%;
    display: inline-block;
    /*border: 1px solid #E4E7ED;*/
  }
  .icon {
    display: inline-block;
    margin-top: 16px!important;
    margin-right: 10px;
    cursor: pointer;
  }
  .inputWidth {
    width: 100%;
  }
}
</style>
