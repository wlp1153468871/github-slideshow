<template>
  <div id="servicedetail1" v-if="$can('platform.applications.view')">
    <div class="detail-header">
      <breadcrumb
        :links="[
          { text: '应用模板管理', route: { path: '/seeting/application' } },
          { text: `${appInfo.name}` },
        ]"
      >
      </breadcrumb>
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
          <span>已启用</span>
        </div>
        <div class="title-desc-name" v-else>
          <svg class="icon" style="color: #CCD1D9">
            <use :xlink:href="`#icon_status-dot-small`"></use>
          </svg>
          <span>已禁用</span>
        </div>
        <div class="title1">创建于：</div>
        <div class="title-desc-name">
          {{ appInfo.createdAt | unix_date('YYYY-MM-DD HH:mm:ss') }}
        </div>
      </div>
      <dao-dropdown
        trigger="click"
        :append-to-body="true"
        placement="bottom-start"
        class="more"
        v-if="$can('platform.applications.available')"
      >
        <button class="dao-btn has-icons">
          <span class="text">更多操作</span>
          <svg class="icon"><use xlink:href="#icon_down-arrow"></use></svg>
        </button>
        <dao-dropdown-menu slot="list" style="min-width: 100px;">
          <dao-dropdown-item @click="editInfo">
            <span>编辑基本信息</span>
          </dao-dropdown-item>
          <!-- <dao-dropdown-item @click="addEdition">
            <span>添加版本</span>
          </dao-dropdown-item> -->
          <dao-dropdown-item
            v-if="appInfo.available"
            @click="availableOff"
          >
            <span>禁用应用</span>
          </dao-dropdown-item>
          <dao-dropdown-item v-else @click="availableOn">
            <span>启用应用</span>
          </dao-dropdown-item>
          <!-- <dao-dropdown-item>
            <span style="color: red;" @click="deleteApplication">删除</span>
          </dao-dropdown-item> -->
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
              <div class="desc-title">服务描述</div>
              <div class="desc-text">{{appInfo.description}}</div>
            </div>
            <div class="app">
              <div class="app-title">服务信息</div>
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
            <marked :text="appInfo.content"></marked>
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
                <div class="right-desc">({{data.email}})</div>
              </div>
              <div class="right-name">官网链接</div>
              <div class="right-link">
                <a :href="`${item.homeUrl}`">{{item.homeUrl}}</a>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="实例" name="thrid">
        <dao-input
          search
          placeholder="搜索"
          v-model="instanceKey"
          @change="searchInstance"
        >
        </dao-input>
        <span style="float: right;">
          <button class="dao-btn icon-btn" style="margin-left: 10px;" @click="freshInstance">
            <svg class="icon"><use xlink:href="#icon_cw"></use></svg>
          </button>
        </span>
        <div style="margin-top: 15px;">
          <el-table
            style="width: 100%;"
            :data="instances"
            v-loading="loading.instance"
          >
            <el-table-column label="实例名" prop="name">
              <!-- <template slot-scope="scope">
                <div
                  style="color: #217EF2;cursor: pointer;"
                  @click="linkInstance(scope.row.appId, scope.row.id)"
                >
                  {{ scope.row.name }}
                </div>
              </template> -->
            </el-table-column>
            <el-table-column label="Chart 版本" prop="chartVersion"></el-table-column>
            <el-table-column label="租户/项目组">
              <template slot-scope="scope">
                {{scope.row.organizationName}}/{{scope.row.spaceName}}
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <svg class="icon" :class="stateClass(scope.row.status)">
                  <use :xlink:href="`#icon_status-dot-small`"></use>
                </svg>
                <span>{{ scope.row.status | ops_status }}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建者" prop="ownerName"></el-table-column>
            <el-table-column label="创建日期">
              <template slot-scope="scope">
                {{ scope.row.createdAt | unix_date('YYYY-MM-DD HH:mm:ss') }}
              </template>
            </el-table-column>
          </el-table>
          <div class="footer">
            <div class="page">共 {{instancesNum()}} 项</div>
            <el-pagination
              v-if="total"
              :page-sizes="[10, 15, 20, 25]"
              :page-size="100"
              :current-page.sync="currentPage"
              layout="sizes, prev, pager, next"
              style="padding-top: 5px;"
              @size-change="changeSize"
              @current-change="handleCurrentChange"
              :total="total"
            >
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script src="./detail.js"></script>

<style lang="scss" src="./detail.scss"></style>
