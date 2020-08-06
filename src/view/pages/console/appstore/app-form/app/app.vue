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
        <div class="dao-setting-label dao-name">实例名称</div>
        <div class="dao-setting-content">
          <dao-input
            block
            style="width: 98%"
            placeholder="请应用名称">
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
              action="http://baidu.com"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              multiple
            >
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
              v-model="select"
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
              v-model="select"
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
              v-model="value"
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
              action="http://baidu.com"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              multiple
            >
              <button class="dao-btn">上传文件</button>
            </el-upload>
        </div>
      </div>
    </dao-setting-layout>
    <div class="dao-setting-layout-footer footer-lay">
      <div class="btn-layout">
        <button class="dao-btn">取消</button>
        <button class="dao-btn blue">确认创建</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'newApp',
  data() {
    return {
      value: '',
      select: 1,
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
    };
  },
  methods: {
    cancerForm() {
      this.config.visible = true;
    },
    close() {
      this.config.visible = false;
    },
    giveUp() {
      this.$router.go(-1);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
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
