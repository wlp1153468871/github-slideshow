<template>
  <div id="servicedetail1">
    <div class="layout-content-header detail-header">
      <!-- <div class="header-text">服务 > 服务详情(Nginx)</div> -->
      <el-breadcrumb separator-class="el-icon-arrow-right" class="header-text">
        <el-breadcrumb-item
          :to="{ path: '/seeting/application' }"
          class="header-text"
        >
          应用模板管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{appInfo.name}}({{appInfo.zoneName}})</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detail-title">
      <img :src="`http://jizhidev.k8s01.ats${appInfo.pictureUrl}`" class="icon-size" v-if="appInfo.pictureId"/>
      <img src="@/assets/images/card-Default.png" class="icon-size"  v-else/>
      <div class="title-name">{{appInfo.name}}({{appInfo.zoneName}})</div>
      <div class="title-desc">
        状态:
        <div class="title-desc-name" v-if="appInfo.available">
          <svg class="icon" style="color: #25D473">
            <use :xlink:href="`#icon_status-dot-small`"></use>
          </svg>
          <span>已上架</span>
        </div>
        <div class="title-desc-name" v-else>
          <svg class="icon" style="color: #CCD1D9">
            <use :xlink:href="`#icon_status-dot-small`"></use>
          </svg>
          <span>已下架</span>
        </div>
        <div class="title1">创建于：</div>
        <div class="title-desc-name">
          {{ appInfo.createdAt | unix_date('YYYY/MM/DD HH:mm:ss') }}
        </div>
      </div>
      <dao-dropdown
        trigger="click"
        :append-to-body="true"
        placement="bottom-start"
        class="more"
      >
        <button class="dao-btn has-icons">
          <span class="text">更多操作</span>
          <svg class="icon"><use xlink:href="#icon_down-arrow"></use></svg>
        </button>
        <dao-dropdown-menu slot="list" style="min-width: 100px;">
          <dao-dropdown-item style="margin-left: 10px">
            <span @click="editInfo">编辑基本信息</span>
          </dao-dropdown-item>
          <dao-dropdown-item style="margin-left: 10px">
            <span @click="addEdition">添加版本</span>
          </dao-dropdown-item>
          <dao-dropdown-item style="margin-left: 10px" v-if="appInfo.available">
            <span>下架应用</span>
          </dao-dropdown-item>
          <dao-dropdown-item style="margin-left: 10px" v-else>
            <span>上架应用</span>
          </dao-dropdown-item>
          <dao-dropdown-item style="margin-left: 10px">
            <span style="color: red;">删除</span>
          </dao-dropdown-item>
        </dao-dropdown-menu>
      </dao-dropdown>
    </div>
    <dao-dialog
      :visible.sync="configEdit"
      header="编辑基本信息"
    >
      <div class="dao-setting-layout">
        <div class="dao-setting-section" style="padding: 20px;">
          <div class="dao-setting-item">
            <div class="dao-setting-label dao-name">自定义应用名称</div>
            <div class="dao-setting-content">
              <dao-input
                v-model="form.name"
                block
                :disabled="appInfo.isGlobal"
                style="width: 98%"
                placeholder="请输入应用名称">
              </dao-input>
            </div>
          </div>
        </div>
        <div class="dao-setting-section">
          <div class="dao-setting-item">
            <div class="dao-setting-label dao-name">应用图标</div>
            <div class="dao-setting-content">
              <div class="desc">建议大小120 像素 x 120 像素，支持 PNG，文件小于 1 MB</div>
              <div v-show="isShow">
                <img
                  :src="`http://jizhidev.k8s01.ats${appInfo.pictureUrl}`"
                  alt="应用图标"
                  class="pic"
                  v-if="appInfo.pictureId"/>
                <img
                  src="@/assets/images/card-Default.png"
                  class="pic"
                  v-else/>
                <div>
                  <button
                    class="dao-btn red"
                    @click="changeShow">
                    删除
                  </button>
                </div>
              </div>
              <el-upload
                v-show="!isShow"
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
            <div class="dao-setting-label dao-name">分类</div>
            <div class="dao-setting-content">
              <el-select
                v-model="form.category"
                multiple
                default-first-option
                placeholder="选择分类"
                style="width: 98%;">
                <el-option
                  v-for="item in categories"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id">
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
                style="width: 98%; height:20px"
              >
              </textarea>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <button class="dao-btn ghost" @click="editClose">
          取消
        </button>
        <button class="dao-btn blue" @click="handleUpload">
          确认
        </button>
      </div>
    </dao-dialog>
    <dao-dialog
      :visible.sync="configAdd"
      header="添加版本"
    >
      <div class="dao-setting-layout">
        <div class="dao-setting-section" style="padding: 20px;">
          <div class="dao-setting-item">
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
        </div>
      </div>
      <div slot="footer">
        <button class="dao-btn ghost" @click="addClose">取消</button>
        <button class="dao-btn blue" @click="handleUploadChart">确认</button>
      </div>
    </dao-dialog>
    <el-tabs v-model="activeName" style="position:relative;">
      <el-tab-pane label="概览" name="first">
        <div class="lay-left">
          <div class="border-box">
            <div class="title">基本信息</div>
            <div class="appdesc">
              <div class="desc-title">应用描述</div>
              <div class="desc-text">{{appInfo.description}}</div>
            </div>
            <div class="app">
              <div class="app-title">应用信息</div>
              <div class="app-box">
                <div class="text-name">
                  服务类型
                  <div class="text-desc">{{appInfo.appType}}</div>
                </div>
                <div class="text-name">
                  分类
                  <div class="text-desc">
                    <template>
                      <span
                        class="str"
                        v-for="(item, index) in appInfo.category"
                        :key="index">
                        {{item}}
                      </span>
                    </template>
                  </div>
                </div>
              </div>
              <div class="app-box">
                <div class="text-name">
                  供应商
                  <div class="text-desc">{{appInfo.provider}}</div>
                </div>
                <div class="text-name">
                  版本数
                  <div class="text-desc">{{appInfo.numVersion}}</div>
                </div>
              </div>
              <div class="app-box">
                <div class="text-name">
                  可用区
                  <div class="text-desc">{{appInfo.zoneName}}</div>
                </div>
                <div class="text-name">
                  Chart 仓库
                  <div class="text-desc">{{appInfo.chartRepo}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="border-box reademe" v-if="appInfo.content">
            <div class="title name">README</div>
            <mark-down class="content" :text="`${appInfo.content}`"></mark-down>
          </div>
        </div>
        <div class="lay-right">
          <div v-if="applicationInfos.length < 1" class="no-version">
            <div class="center">
              <div class="no">暂无版本</div>
              <div class="add">立即添加</div>
            </div>
          </div>
          <div v-for="(item, index) in applicationInfos" :key="index" v-else>
            <div v-if="chart === item.version">
              <div class="right-type">版本:</div>
              <dao-select
                v-model="chart"
                size="sm"
                class="right-select"
              >
                <dao-option
                  v-for="item in applicationInfos"
                  :key="item.version"
                  :value="item.version"
                  :label="item.version">
                </dao-option>
              </dao-select>
              <div class="right-name">名称</div>
              <div class="right-desc">{{item.chartName}}</div>
              <div v-if="`${item.appVersion }`">
                <div class="right-name">App版本</div>
                <div class="right-desc">{{item.appVersion}}</div>
              </div>
              <div class="right-name">维护者</div>
              <div v-for="(data, key) in item.supplier" :key="key">
                <div class="right-desc">{{data.name}}</div>
                <div class="right-desc">{{data.email}}</div>
              </div>
              <div class="right-name">官网链接</div>
              <a :href="`${item.homeUrl}`" class="right-link">{{item.homeUrl}}</a>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="项目组" name="second">
        <div class="project">
          状态：
          <dao-select
            v-model="select"
            size="sm"
            class="select"
          >
            <dao-option
              v-for="item in status"
              :key="item.available"
              :value="item.available"
              :label="item.value">
            </dao-option>
          </dao-select>
          <span class="selectStatus" v-if="selectStatus.length">
            <span class="number">已选择 1 项</span>
            <button
              class="dao-btn status"
              v-if="selectStatus[0] === '0' && selectStatus.length === 1">批量上架
            </button>
            <button
              class="dao-btn status"
              v-if="selectStatus[0] === '1' && selectStatus.length === 1">批量下架
            </button>
          </span>
          <span class="iconlay">
            <button class="dao-btn icon-btn" style="margin-left: 10px;">
              <svg class="icon"><use xlink:href="#icon_cw"></use></svg>
            </button>
          </span>
          <dao-input
            search
            placeholder="搜索"
            class="input"
          >
          </dao-input>
          <div style="margin-top: 20px;">
            <el-table
              style="width: 100%;"
              :data="orginization"
              @select="selectChange"
              @selection-change="selectAll"
            >
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column label="项目组名" prop="name"></el-table-column>
              <el-table-column label="状态">
                <template slot-scope="scope">
                  <div v-if="scope.row.available === '1'">
                    <svg class="icon" style="color: #25D473">
                      <use :xlink:href="`#icon_status-dot-small`"></use>
                    </svg>
                    <span>已上架</span>
                  </div>
                  <div v-else>
                    <svg class="icon" style="color: rgb(204, 209, 217)">
                      <use :xlink:href="`#icon_status-dot-small`"></use>
                    </svg>
                    <span>已下架</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="项目组唯一标识符" prop="shortName">
                <template slot-scope="scope">
                  <div style="color: #217EF2;cursor: pointer;">
                    {{ scope.row.shortName }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="租户名" prop="organizationName"></el-table-column>
              <!-- <el-table-column label="租户唯一标识符" prop="tenantUnique"></el-table-column> -->
              <el-table-column label="操作" width="80">
                <template slot-scope="scope">
                  <span class="dao-btn-group select-btn">
                    <dao-dropdown
                      trigger="click"
                      :append-to-body="true"
                      placement="bottom-start"
                    >
                      <svg class="icon">
                        <use :xlink:href="`#icon_more`"></use>
                      </svg>
                      <dao-dropdown-menu slot="list" style="min-width: 120px;">
                        <dao-dropdown-item
                          style="margin-left: 10px"
                          v-if="scope.row.available === '1'"
                        >
                          <span>下架应用</span>
                        </dao-dropdown-item>
                        <dao-dropdown-item style="margin-left: 10px" v-else>
                          <span>下架应用</span>
                        </dao-dropdown-item>
                      </dao-dropdown-menu>
                    </dao-dropdown>
                  </span>
                </template>
              </el-table-column>
            </el-table>
            <div class="footer">
              <div class="page">共 1项</div>
              <span class="dao-btn-group" style="padding: 6px 10px 0 0; float: right;">
                <dao-dropdown
                  trigger="click"
                  :append-to-body="true"
                  placement="bottom-start"
                >
                  <button class="dao-btn has-icons" style="width: 92px;height: 28px;">
                    <span class="text">10项/页</span>
                    <svg class="icon"><use xlink:href="#icon_down-arrow"></use></svg>
                  </button>
                  <dao-dropdown-menu slot="list" style="min-width: 120px;">
                    <dao-dropdown-item style="margin-left: 10px">
                      <span>15项/页</span>
                    </dao-dropdown-item>
                    <dao-dropdown-item style="margin-left: 10px">
                      <span>20项/页</span>
                    </dao-dropdown-item>
                    <dao-dropdown-item style="margin-left: 10px">
                      <span>25项/页</span>
                    </dao-dropdown-item>
                  </dao-dropdown-menu>
                </dao-dropdown>
              </span>
            </div>
          </div>
        </div>

      </el-tab-pane>
      <el-tab-pane label="实例" name="thrid">
        <dao-input
          search
          placeholder="搜索">
        </dao-input>
        <span style="float: right;">
          <button class="dao-btn icon-btn" style="margin-left: 10px;">
            <svg class="icon"><use xlink:href="#icon_cw"></use></svg>
          </button>
        </span>
        <div style="margin-top: 20px;">
          <el-table
            style="width: 100%;"
            :data="instances"
          >
            <el-table-column label="实例名" prop="name"></el-table-column>
            <el-table-column label="Chart 版本" prop="chartVersion" width="100"></el-table-column>
            <el-table-column label="租户/项目组" prop="tenant"></el-table-column>
            <el-table-column label="状态" width="100">
              <template slot-scope="scope">
                <svg class="icon" style="color: #25D473">
                  <use :xlink:href="`#icon_status-dot-small`"></use>
                </svg>
                <span>{{ scope.row.status }}</span>
                <!-- <div v-if="scope.row.available === '1'">
                  <svg class="icon" style="color: #25D473">
                    <use :xlink:href="`#icon_status-dot-small`"></use>
                  </svg>
                  <span>已上架</span>
                </div>
                <div v-else>
                  <svg class="icon" style="color: rgb(204, 209, 217)">
                    <use :xlink:href="`#icon_status-dot-small`"></use>
                  </svg>
                  <span>已下架</span>
                </div> -->
              </template>
            </el-table-column>
            <el-table-column label="创建者" prop="ownerName"></el-table-column>
            <el-table-column label="创建日期">
              <template slot-scope="scope">
                {{ scope.row.createdAt | unix_date('YYYY/MM/DD HH:mm:ss') }}
              </template>
            </el-table-column>
          </el-table>
          <div class="footer">
            <div class="page">共 1 项</div>
            <span class="dao-btn-group" style="padding: 6px 10px 0 0; float: right;">
              <dao-dropdown
                trigger="click"
                :append-to-body="true"
                placement="bottom-start"
              >
                <button class="dao-btn has-icons" style="width: 92px;height: 28px;">
                  <span class="text">10项/页</span>
                  <svg class="icon"><use xlink:href="#icon_down-arrow"></use></svg>
                </button>
                <dao-dropdown-menu slot="list" style="min-width: 120px;">
                  <dao-dropdown-item style="margin-left: 10px">
                    <span>15项/页</span>
                  </dao-dropdown-item>
                  <dao-dropdown-item style="margin-left: 10px">
                    <span>20项/页</span>
                  </dao-dropdown-item>
                  <dao-dropdown-item style="margin-left: 10px">
                    <span>25项/页</span>
                  </dao-dropdown-item>
                </dao-dropdown-menu>
              </dao-dropdown>
            </span>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script src="./detail.js"></script>

<style lang="scss" src="./detail.scss"></style>
