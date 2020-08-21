<template>
  <div class="new-app">
    <div class="newApp-nav">
      <span style="color: #217EF2;font-size: 25px;cursor: pointer" @click="handleBack">×</span>
      <span>新建应用</span>
    </div>
    <div class="newApp-box">
      <dao-setting-layout>
          <template slot="layout-title">
            <div class="base-info">基本信息</div>
          </template>
<!--        <dao-setting-section>-->
<!--          <template slot="label">应用名称</template>-->
<!--          <template slot="content">-->
<!--&lt;!&ndash;            <input class="input-width" placeholder="输入应用名称"></input>&ndash;&gt;-->
<!--            <dao-input-->
<!--              v-model="appName"-->
<!--              block-->
<!--              :class="{'demo-width': isWidthLimit}"-->
<!--              placeholder="请输入内容">-->
<!--            </dao-input>-->
<!--          </template>-->
<!--        </dao-setting-section>-->
        <dao-setting-section>
          <template slot="label">应用图标</template>
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
            <dao-select
              v-model="category"
              placeholder="选择分类">
              <dao-option
                v-for="item in classification"
                :key="item.value"
                :value="item.value"
                :label="item.text">
              </dao-option>
            </dao-select>
          </template>
        </dao-setting-section>
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
            ref="upload"
            action="#"
            :http-request="handleUpload"
            :file-list="fileList"
            accept="image/png"
            :limit="1"
            :before-upload="beforeUpload"
            :on-remove="removeFile">
            <button class="dao-btn blue">上传文件</button>
          </el-upload>
        </template>
      </dao-setting-section>
      </dao-setting-layout>
    </div>
<!--    底部取消-->
    <div class="footer">
      <div class="btn-style">
        <button class="dao-btn" @click="handleCancel">取消</button>
        <button class="dao-btn blue" @click="handleCancel">确认创建</button>
      </div>
    </div>
  </div>
</template>

<script>
  import Space from '../../../../manage/org/org-detail/panels/space';
  import DaoSettingSection from '../../../../../components/daox/setting-layout/setting-section';
  export default {
    name: 'new-app',
    components: { DaoSettingSection, Space },
    data() {
      return {
        appName: '', // 应用名称
        isWidthLimit: false,
        appType: '', // 服务类型
        fileList: [], // 上传图标
        options: [{
          text: 'Helm Chart',
          value: 1,
        }, {
          text: 'Helm Chart',
          value: 2,
        }],
        category: '', // 分类
        classification: [{
          text: 'Helm Chart',
          value: 1,
        }, {
          text: 'Helm Chart',
          value: 2,
        }],
        description: '', // 描述,
        pictureId: '', // 上传图标的id
      };
    },
    methods: {
      handleCancel() {
        this.$router.push({ name: 'zone.detail' });
      },
      handleBack() {
        this.$router.push({ name: 'zone.detail' });
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
       * 文件上传
       */
      handleUpload() {
        this.isDisabled = true;
        const file = this.fileList[0];
        AppStoreService.uploadPic(file)
          .then(res => {
            this.form.pictureId = res.id;
            this.createApp();
          })
          .catch(err => {
            this.removeFile();
            this.$message.error(err);
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
<style scoped>
.new-app {
  min-height: 100vh;
  background-color: #F1F3F6;
  border: 1px solid #F1F3F6;
}
.new-app .newApp-nav {
  position: fixed;
  background-color: #fff;
  line-height: 51px;
  width: 100%;
  font-weight: 700;
  font-size: 16px;
  z-index: 999;
}
.newApp-nav span {
  margin-left: 20px;
}
  .new-app .newApp-box {
    box-sizing: border-box;
    width: 80%;
    background-color: #fff;
    margin: 71px auto 0px auto;
  }
  .newApp-box .base-info {
    width: 100%;
    margin-left: 20px;
    font-weight: 700;
    font-size: 16px;
    padding: 10px 0px;
  }
  .content-text {
    font-size: 12px;
  }
  .new-app .dao-control {
    width: 100%;
  }
  .new-app #chart-file {
    margin-top: 20px;
    margin-bottom: 70px;
  }
  .new-app .footer {
    height: 51px;
    background-color: #fff;
    z-index: 999;
    position: absolute;
    bottom: 0;
    width: 100%;

    /*display: flex;*/
    /*flex-direction: row-reverse;*/
    /*justify-content: flex-end;*/
    /*align-items: center;*/
  }
  .footer .btn-style {
    position: absolute;
    top: 10px;
    left: 80%;
    display: flex;
  }
</style>
