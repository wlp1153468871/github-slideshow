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
              style="width: 98%;height: 32px;"
              placeholder="选择服务类型"
            >
              <dao-option
                v-for="item in appTypes"
                :key="item"
                :value="item"
                :label="item">
              </dao-option>
            </dao-select>
          </div>
        </div>
      </div>
      <div class="dao-setting-section">
        <div class="dao-setting-item">
          <div class="dao-setting-label dao-name">分类</div>
          <div class="dao-setting-content">
            <el-select
              v-model="form.category"
              multiple
              default-first-option
              placeholder="选择分类"
              style="width: 98%;">
              <el-option
                v-for="(item, index) in categories"
                :key="item.name"
                :label="item.name"
                :value="`${index}`">
              </el-option>
            </el-select>
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
              style="width: 98%;"
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
      <div class="dao-setting-item" style="height: 62px;">
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
        <button class="dao-btn" @clcik="cancerForm">取消</button>
        <button class="dao-btn blue" @click="handleUpload">确认创建</button>
      </div>
    </div>
  </div>
</template>

<script src="./app.js"></script>

<style lang="scss" src="./app.scss" scoped></style>
