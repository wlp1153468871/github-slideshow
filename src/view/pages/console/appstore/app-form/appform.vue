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
        @before-close="destoryDialog"
      >
        <div class="dialog_body">确认是否放弃当前编辑，放弃后不可撤销。</div>
        <div slot="footer">
          <button class="dao-btn red" @click="giveUp">放弃</button>
          <button class="dao-btn" @click="close">取消</button>
        </div>
      </dao-dialog>
      <span class="form-title">
        <span v-if="this.$route.query.instanceId">
          更新实例 {{this.chartName}}  {{this.$route.params.version}}
        </span>
        <span v-else>
          创建实例 {{this.chartName}}  {{this.$route.params.version}}
        </span>
      </span>
    </div>
    <div class="yaml_content_box">
      <dao-setting-layout class="basic-info">
        <div class="dao-setting-section">
          <div class="dao-setting-title title-text">基本信息</div>
        </div>
        <div class="dao-setting-item" style="height: 42px;">
          <div class="dao-setting-label dao-name">实例名称</div>
          <div class="dao-setting-content">
            <div v-if="this.$route.query.instanceId">{{this.instanceName}}</div>
            <dao-input
              block
              v-model="instanceName"
              style="width: 98%"
              placeholder="请输入内容"
              v-else>
            </dao-input>
          </div>
        </div>
        <div class="dao-setting-section">
          <div class="dao-setting-item">
            <div class="dao-setting-label dao-name">版本</div>
            <div class="dao-setting-content">{{this.$route.params.version}}</div>
          </div>
        </div>
      <!-- <div class="dao-setting-section">
        <div class="dao-setting-item">
          <div class="dao-setting-label dao-name">租户和项目组</div>
          <div class="dao-setting-content">
            <div class="box">
              <div class="dao-title">租户</div>
              <dao-select
                v-model="select1"
                class="dao-option"
                size="sm">
                <dao-option
                  v-for="item in zones"
                  :key="item.value"
                  :value="item.index"
                  :label="item.value">
                </dao-option>
              </dao-select>
            </div>
            <div class="box">
              <div class="dao-title">项目组</div>
              <dao-select
                v-model="select2"
                class="dao-option"
                size="sm">
                <dao-option
                  v-for="item in project"
                  :key="item.value"
                  :value="item.index"
                  :label="item.value">
                </dao-option>
              </dao-select>
            </div>
          </div>
        </div>
      </div> -->
      </dao-setting-layout>
      <div class="parameter">
        <div class="header">
          <div class="title">参数设置</div>
        </div>
        <div class="table">
          <el-table
            border
            :data="table"
            style="width: 100%;"
            v-loading.fullscreen.lock="loading"
            element-loading-text="正在拼命创建中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
        >
            <el-table-column label="key" prop="name"></el-table-column>
            <el-table-column label="value">
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
    </div>

    <div class="dao-setting-layout-footer footer-lay">
      <div class="btn-layout">
        <button class="dao-btn" @click="cancerForm">取消</button>
        <button class="dao-btn blue"
          @click="updateForm"
          v-if="this.$route.query.instanceId"
        >确认更新</button>
        <button class="dao-btn blue" @click="createForm" v-else>确认创建</button>
      </div>
    </div>
  </div>
</template>

<script src="./appform.js"></script>

<style lang="scss" src="./appform.scss"></style>

