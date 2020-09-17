<template>
  <div class="app">
    <div class="layout-content-header form-header">
      <span @click="cancerForm">
        <span style="color: #217EF2;font-size: 25px;cursor: pointer">×</span>
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
    <div class="app-box">
      <dao-setting-layout class="basic-info">
        <div class="dao-setting-section">
          <div class="dao-setting-title title-text">可用区</div>
        </div>
        <div class="dao-setting-item" style="height: 62px;">
          <div class="dao-setting-label dao-name">选择可用区</div>
          <div class="dao-setting-content">
            <dao-select
              v-model="zoneId"
              class="dao-option"
              size="sm"
              style="width: 98%;height: 32px;"
              placeholder="选择可用区"
            >
              <dao-option
                v-for="item in zoneList"
                :key="item.id"
                :value="item.id"
                :label="item.name">
              </dao-option>
            </dao-select>
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
              :on-remove="removeChart">
              <button class="dao-btn blue">上传chart</button>
            </el-upload>
          </div>
        </div>
      </dao-setting-layout>
      <dao-setting-layout class="basic-info" style="margin-bottom: 66px">
        <div class="dao-setting-section">
          <div class="dao-setting-title title-text">基本信息</div>
        </div>
        <div class="dao-setting-item" style="height: 42px;">
          <div class="dao-setting-label dao-name">模板名称</div>
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
            <div class="dao-setting-label dao-name">模板图标</div>
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
              <svg class="icon" @click="addCategory" style="margin-top: 16px">
                <use :xlink:href="`#icon_plus-circled`"></use>
              </svg>
              <el-select
                v-model="form.category"
                multiple
                default-first-option
                placeholder="选择分类"
                style="width: 97%;">
                <el-option
                  v-for="item in categories"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <!--        新增分类弹窗-->
        <div v-if="categoryConfig.showAddCategory">
          <div class="dao-dialog demo2">
            <dao-dialog
              :visible.sync="categoryConfig.showAddCategory"
              :header="categoryConfig.header"
              @confirm="submit">
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
    </div>
    <div class="dao-setting-layout-footer footer-lay">
      <div class="btn-layout">
        <button class="dao-btn" @click="cancel">取消</button>
        <button class="dao-btn blue" @click="createApp">确认创建</button>
      </div>
    </div>
  </div>
</template>

<script src="./app.js"></script>

<style lang="scss" src="./app.scss" scoped></style>
