<template>
  <div class="new-app">
    <!--头部展示-->
    <div class="newApp-nav">
      <span class="cancel" @click="cancer">×</span>
      <span class="nav-model">新建应用模板</span>
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
    <!--    chart文件-->
    <div class="newApp-box">
      <div class="chart-file" id="chart-file">
        <dao-setting-layout>
          <div class="base-info">Chart文件</div>
<!--          <template slot="layout-title">-->
<!--            <div class="base-info">Chart文件</div>-->
<!--          </template>-->
          <dao-setting-section>
            <template slot="label">
              <span class="chartName-rule">*</span>
              chart文件</template>
            <template slot="content">
              <div class="content-text">支持zip, gzip, tgz, tar格式的压缩文件上传</div>
            </template>
            <template slot="content">
              <el-upload
                class="upload-demo"
                ref="uploadChart"
                action="#"
                :http-request="handleUploadChart"
                :file-list="chartList"
                accept="application/zip, application/x-compressed,
                application/x-gzip, application/gzip, application/x-tar"
                :before-upload="beforeUploadChart"
                :on-remove="removeFileChart"
              >
                <button class="dao-btn blue">上传chart</button>
              </el-upload>
            </template>
          </dao-setting-section>
        </dao-setting-layout>
      </div>
      <div class="box-layout">
        <dao-setting-layout>
          <div class="base-info">基本信息</div>
<!--          <template slot="layout-title">-->
<!--            <div class="base-info">基本信息</div>-->
<!--          </template>-->
          <dao-setting-section>
            <template slot="label">
              <span class="chartName-rule">*</span>
              模板名称</template>
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
            <template slot="label">
              <span class="chartName-rule">*</span>
              模板图标</template>
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
            <template slot="label">
              <span class="chartName-rule">*</span>
              供应商</template>
            <template slot="content">
              <dao-input
                style="width: 100%"
                v-model="provider"
                block
                required
                placeholder="请填写供应商"></dao-input>
            </template>
          </dao-setting-section>
          <dao-setting-section>
            <template slot="label">
              <span class="chartName-rule">*</span>
              是否认证</template>
            <template slot="content">
              <el-radio-group v-model="daoAuth">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </template>
          </dao-setting-section>
          <dao-setting-section>
            <template slot="label">
              <span class="chartName-rule">*</span>
              服务类型
            </template>
            <template slot="content">
              <dao-select
                class="category-style"
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
            <template slot="label">
              <span class="chartName-rule">*</span>
              分类
            </template>
            <template slot="content">
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
            <template slot="content">
              <div class="svg-icon">
                <svg class="icon">
                  <use :xlink:href="`#icon_plus-circled`"></use>
                </svg>
                <span @click="addCategory" class="add-cate">添加分类</span>
              </div>
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
                placeholder="请填写内容，字数限制为200字"
                required
                v-model="description">
              </textarea>
            </template>
          </dao-setting-section>
        </dao-setting-layout>
      </div>
    </div>
<!--    底部取消-->
    <div class="newApp-footer">
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
      }],
      name: '', // 应用名称
      description: '', // 描述,
      pictureId: '', // 上传图标的id
      daoAuth: false, // 是否上传
      provider: '',
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
  // watch: {
  //   provider: {
  //     handler(value) {
  //       if (value.length > 32) {
  //         this.$noty.error('供应商字段不能超过32位');
  //         this.provider = this.value.slice(0, 32);
  //       }
  //     },
  //   },
  // },*/
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
      if (this.categoryName === '') {
        this.$noty.error('分类名称不能为空');
      } else if (this.categoryName.length > 32) {
        this.categoryName = '';
        this.$noty.error('分类名称长度不能超过32');
      } else {
        ZoneAdminService.addCategory(this.categoryName).then(res => {
          this.classification.push(res);
          this.$noty.success('新增分类成功');
        });
        this.categoryName = '';
        this.config.showAddCategory = false;
      }
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
        this.$router.push({
          name: 'manage.zone.detail',
          params: {
            zone: this.$route.params.id,
          },
          query: {
            tab: 'APPLICATION',
          },
        });
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
      const baseSize = 1024 * 1024;
      if (file.size > baseSize) {
        this.$noty.warning('请上传文件小于1MB');
        this.removeFile();
      } else if (this.fileType.indexOf(file.type) < 0) {
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
      if (this.chartList.length === 0) {
        this.$noty.error('chart文件不能为空');
        return;
      } else if (this.pictureId === '') {
        this.$noty.error('模板图标为必传');
        return;
      } else if (this.provider === '' || this.provider.length > 32) {
        this.$noty.error('供应商不能为空且字符长度不能超过32位');
        return;
      } else if (this.appType === '') {
        this.$noty.error('服务类型不能为空');
        return;
      } else if (this.category.length === 0) {
        this.$noty.error('分类不能为空');
        return;
      } else if (this.description.length > 200) {
        this.$noty.error('描述的字符长度不能大于200');
        return;
      }
      const formData = {
        name: this.name,
        provider: this.provider,
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
      this.chartList = [];
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
      // this.chartList = [];
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

<style scoped lang="scss">
.new-app {
  display: flex;
  justify-content: center;
  .newApp-nav {
    position: fixed;
    background-color: #fff;
    left: 0px;
    right: 0px;
    z-index: 999;

    line-height: 50px;
    border-bottom: 1px solid #CCD1D9;
    .cancel {
      color: #217EF2;
      font-size: 25px;
      cursor: pointer;
    }
    span {
      margin-left: 20px;
    }
    .nav-model {
      color: #3D444F;
      font-weight: 600;
      font-size: 16px;
      margin-left: 15px;
    }
    .body {
      padding: 20px;
    }
  }
  .newApp-box {
    width: 90%;
    margin-top: 55px;
    margin-bottom: 50px;
    overflow: scroll;
    /* overflow-style: auto; */
    .chart-file, .box-layout {
      max-width: 960px;
      margin: 0 auto;
    }
    .chart-file {
      margin-top: 20px;
      margin-bottom: 20px;
      .base-info {
        line-height: 50px;
        background-color: #fff;
        border-bottom: 1px solid #E4E7ED;
        color: #3D444F;
        font-weight: 600;
        font-size: 14px;
      }
      .chartName-rule {
        color: #ff0000;
      }
    }
    .box-layout {
      margin-bottom: 10px;
      .base-info {
        line-height: 50px;
        background-color: #fff;
        border-bottom: 1px solid #E4E7ED;
        color: #3D444F;
        font-weight: 600;
        font-size: 14px;
      }
      .chartName-rule {
        color: #ff0000;
      }
      .category-style, .dao-control {
        width: 100%;
      }
      .add-cate {
        cursor: pointer;
      }
    }
  }
  .newApp-box::-webkit-scrollbar {
    display: none;
  }
  .newApp-footer {
    position: fixed;
    bottom: 0px;
    right: 0px;
    left: 0px;
    background-color: #fff;

    line-height: 50px;
    z-index: 999;
    display: flex;
    justify-content: flex-end;
    .btn-style {
      margin-right: 30px;
    }
  }
}
</style>

<!--<style lang="scss">-->
<!--.layout{-->
<!--  overflow: auto !important;-->
<!--}-->
<!--.newApp-box .dao-select {-->
<!--  width: 100%;-->
<!--}-->
<!--.new-app {-->
<!--  min-height: 915px;-->
<!--  background-color: #F1F3F6;-->
<!--  border: 1px solid #F1F3F6;-->
<!--  .newApp-nav {-->
<!--    position: fixed;-->
<!--    background-color: #fff;-->
<!--    line-height: 51px;-->
<!--    width: 100%;-->
<!--    font-weight: 700;-->
<!--    font-size: 16px;-->
<!--    z-index: 999;-->
<!--    span {-->
<!--      margin-left: 20px;-->
<!--    }-->
<!--    .body {-->
<!--      padding: 20px;-->
<!--    }-->
<!--  }-->
<!--  .box-layout {-->
<!--    padding-top: 40px;-->
<!--    padding-bottom: 40px;-->
<!--  }-->
<!--  .newApp-box {-->
<!--    box-sizing: border-box;-->
<!--    width: 80%;-->
<!--    margin: 20px auto 40px auto;-->
<!--    padding-bottom: 80px;-->
<!--    .daox-setting-layout {-->
<!--      background: #fff;-->
<!--    }-->
<!--    .dao-setting-label {-->
<!--      &::before{-->
<!--        content: '* ';-->
<!--        color: red;-->
<!--      }-->
<!--    }-->
<!--    /* .dao-setting-label::after {-->
<!--      content: '* ';-->
<!--      color: red;-->
<!--    } */-->
<!--    .base-info {-->
<!--      width: 100%;-->
<!--      margin-left: 20px;-->
<!--      font-weight: 600;-->
<!--      font-size: 16px;-->
<!--      padding: 10px 0px;-->
<!--    }-->
<!--  }-->
<!--  .content-text {-->
<!--    font-size: 12px;-->
<!--  }-->
<!--  .dao-control {-->
<!--    width: 100%;-->
<!--  }-->
<!--  #chart-file {-->
<!--    margin-top: 70px;-->
<!--  }-->
<!--  .footer {-->
<!--    height: 55px;-->
<!--    background-color: #fff;-->
<!--    z-index: 999;-->
<!--    position: fixed;-->
<!--    bottom: 0;-->
<!--    width: 100%;-->
<!--    display: flex;-->
<!--    justify-content: flex-end;-->
<!--    align-items: center;-->
<!--    .btn-style {-->
<!--      margin-right: 30px;-->
<!--    }-->
<!--  }-->
<!--  .category-style {-->
<!--    width: 100%;-->
<!--    display: inline-block;-->
<!--    .el-input {-->
<!--      height: 32px !important;-->
<!--      .el-input__inner {-->
<!--        height: 32px !important;-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--  .svg-icon {-->
<!--    width: 90px;-->
<!--    svg {-->
<!--      fill: #3289F7;-->
<!--    }-->
<!--    .icon {-->
<!--      width: 16px;-->
<!--      height: 16px;-->
<!--      cursor: pointer;-->
<!--    }-->
<!--    .add-cate {-->
<!--      padding: 20px 0 0 6px;-->
<!--      padding-left: 6px;-->
<!--      color: #3289F7;-->
<!--    }-->
<!--  }-->

<!--  .inputWidth {-->
<!--    width: 100%;-->
<!--  }-->
<!--}-->
<!--</style>-->
