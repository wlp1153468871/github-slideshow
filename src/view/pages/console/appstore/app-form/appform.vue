<template>
  <div class="app-form">
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
        创建服务实例 Nginx1.17
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
            placeholder="请输入内容">
          </dao-input>
        </div>
      </div>
      <div class="dao-setting-section" style="height: 62px;">
        <div class="dao-setting-item">
          <div class="dao-setting-label dao-name">版本</div>
          <div class="dao-setting-content">1.9.1</div>
        </div>
      </div>
      <div class="dao-setting-section" style="height: 95px;">
        <div class="dao-setting-item">
          <div class="dao-setting-label dao-name">租户和项目组</div>
          <div class="dao-setting-content">
            <div>
              <div class="dao-title">租户</div>
              <div class="dao-title">项目组</div>
            </div>
            <dao-select
              v-model="select"
              class="dao-option"
              size="sm">
              <dao-option
                v-for="item in items"
                :key="item.value"
                :value="item.value"
                :label="item.text">
              </dao-option>
            </dao-select>
            <dao-select
              v-model="select"
              class="dao-option"
              size="sm">
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
    </dao-setting-layout>
    <div class="parameter">
      <div class="header">
        <div class="title">参数设置</div>
      </div>
      <div class="table">
        <el-table
          :data="tableData"
          style="width: 100%;"
       >
          <el-table-column prop="key" label="key" width="460"></el-table-column>
          <el-table-column prop="value" label="value" width="460">
            <template slot-scope="scope">
              <dao-input
                v-model="scope.row.value"
                block
                style="width: 98%"
                >
              </dao-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="dao-setting-layout-footer footer-lay">
      <div class="btn-layout">
        <button class="dao-btn">预览</button>
        <button class="dao-btn blue">确认创建</button>
      </div>
    </div>
  </div>
</template>

<script src="./appform.js"></script>

<style lang="scss" scoped>

::v-deep .dao-setting-item:last-child .dao-setting-content>:last-child.dao-select {
  margin-bottom: 0;
}
::v-deep .dao-setting-content>:not(:first-child) {
  margin-top: 0;
}
::v-deep .dao-setting-content>:not(:first-child):not(.dao-btn) {
  margin-top: 15px;
}
.app-form {
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
    .dao-title {
      display: inline-block;
      overflow: hidden;
      width: 360px;
      height: 14px;
      line-height: 14px;
      margin-right: 20px;
      font-family: SFProText-Regular,SFProText;
      font-weight: 400;
    }
    .dao-option {
      display: inline-block;
      overflow: hidden;
      margin-right: 20px;
      margin-bottom: 0;
      height: 32px;
      width: 360px;
    }
  }
  .parameter-set {
    margin: 20px 160px 0 160px;
    .dao-name {
      height: 14px;
      line-height: 14px;
      font-family: SFProText-Regular,SFProText;
      font-weight: 400;
      color:#3D444F;
    }
    .dao-desc {
      height: 14px;
      font-size: 14px;
      font-family: SFProText-Regular,SFProText;
      font-weight: 400;
      color: rgba(155,163,175,1);
      line-height: 14px;
    }
  }
  .parameter {
    margin: 20px 160px 0 160px;
    background: #fff;
    height: 400px;
    .header {
      height: 50px;
      border-bottom: 1px solid #E4E7ED;
      .title {
        padding: 18px 0 0 20px;
        height: 14px;
        line-height: 14px;
        font-size: 14px;
        font-family: SFProText-Semibold,SFProText;
        font-weight: 600;
        color: #3D444F;
      }
    }
    .table {
      margin: 20px;
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

