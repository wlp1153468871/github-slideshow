<template>
  <div id="appdetail">
    <div class="layout-content-header detail-header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="header-text">
        <el-breadcrumb-item
          :to="{ path: '/console/appstore' }"
          class="header-text"
        >
          应用
        </el-breadcrumb-item>
        <el-breadcrumb-item>应用详情({{appInfo.name}})</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="left">
      <div class="left-header">
        <div style="padding: 20px;">
          <img :src="`http://jizhidev.k8s01.ats${appInfo.pictureUrl}`" class="icon-size" v-if="appInfo.pictureId"/>
          <img src="@/assets/images/card-Default.png" class="icon-size"  v-else/>
          <div class="header-text">{{appInfo.name}}</div>
          <!-- 新建的应用才有这部分 -->
          <!-- <dao-dropdown
            trigger="click"
            :append-to-body="true"
            placement="bottom-start"
            style="float: right;margin-top: 10px;"
          >
            <button class="dao-btn has-icons" style="width: 98px;">
              <span class="text">更多操作</span>
              <svg class="icon"><use xlink:href="#icon_down-arrow"></use></svg>
            </button>
            <dao-dropdown-menu slot="list" style="min-width: 120px;">
              <dao-dropdown-item style="margin-left: 10px">
                <span @click="editInfo">编辑基本信息</span>
              </dao-dropdown-item>
              <dao-dropdown-item style="margin-left: 10px">
                <span @click="addEdition">添加版本</span>
              </dao-dropdown-item>
              <dao-dropdown-item style="margin-left: 10px">
                <span style="color: red;" @click="deleteApp">删除</span>
              </dao-dropdown-item>
            </dao-dropdown-menu>
          </dao-dropdown> -->
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
                      style="width: 60px;height: 60px;"
                      v-if="appInfo.pictureId"/>
                    <img
                      src="@/assets/images/card-Default.png"
                      style="width: 60px;height: 60px;"
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
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="概览" name="first">
          <div class="base-info">
            <div class="title">基本信息</div>
            <div class="desc">
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
          <div class="base-info" v-if="appInfo.content">
            <div class="title" style="padding: 20px 0 20px 0px;">README</div>
            <mark-down style="padding: 20px;" :text="`${appInfo.content}`"></mark-down>
          </div>
        </el-tab-pane>
        <el-tab-pane label="实例" name="second">
          <dao-input
            search
            @change="updateKey"
            v-model="key"
            placeholder="搜索">
          </dao-input>
          <span style="float: right;" @click="fresh">
            <el-button size="mini" style="margin-left: 10px;">
              <span>
                <svg class="icon">
                  <use :xlink:href="`#icon_cw`"></use>
                </svg>
              </span>
            </el-button>
          </span>
          <div style="margin-top: 20px;">
            <el-table
              style="width: 100%;"
              :data="instanceTable"
            >
              <el-table-column label="实例名称">
                <template slot-scope="scope">
                  <div style="color: #217EF2;cursor: pointer;" @click="rowClick(scope.row.id)">
                    {{ scope.row.name }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="状态" width="80">
                <template slot-scope="scope">
                  <div v-if="scope.row.status === 'deployed'">
                    <svg class="icon" style="color: #25D473">
                      <use :xlink:href="`#icon_status-dot-small`"></use>
                    </svg>
                    <span>成功</span>
                  </div>
                  <div v-else>
                    <svg class="icon" style="color: red">
                      <use :xlink:href="`#icon_status-dot-small`"></use>
                    </svg>
                    <span>失败</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="Chart 版本" prop="chartVersion" width="100"></el-table-column>
              <el-table-column label="创建者" prop="ownerName" width="100"></el-table-column>
              <el-table-column label="创建时间">
                <template slot-scope="scope">
                  {{ scope.row.createdAt | unix_date('YYYY/MM/DD HH:mm:ss') }}
                </template>
              </el-table-column>
              <el-table-column  label="操作" width="60">
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
                        <dao-dropdown-item style="margin-left: 10px">
                          <span @click="linktoForm(scope.row.id)">使用表单更新</span>
                        </dao-dropdown-item>
                        <dao-dropdown-item style="margin-left: 10px">
                          <span @click="linktoYamlForm(scope.row.id)">使用YAML更新</span>
                        </dao-dropdown-item>
                        <dao-dropdown-item style="margin-left: 10px">
                          <span style="color: red;" @click="deleteInstance(scope.row.id)">删除</span>
                        </dao-dropdown-item>
                      </dao-dropdown-menu>
                    </dao-dropdown>
                  </span>
                </template>
              </el-table-column>
            </el-table>
            <div class="footer">
              <div class="page">共 {{instanceNum()}} 项</div>
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
    <div class="right" >
      <div v-if="applicationInfos.length < 1" class="no-version">
        <div class="center">
          <div class="no">暂无版本</div>
          <div class="add" @click="addEdition">立即添加</div>
        </div>
      </div>
      <div v-for="(item, index) in applicationInfos" :key="index" v-else>
        <div v-if="chart === item.version">
          <div class="right-type">Chart 版本:</div>
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
          <button class="dao-btn blue right-btn" @click="showCreate">立即创建</button>
          <!-- <button class="dao-btn delete-btn" @click="showDelete">删除版本</button> -->
          <dao-dialog
            :visible.sync="configCreate"
            :header="`创建实例 | ${item.chartName}`"
          >
            <div class="dao-setting-layout">
              <div class="dao-setting-section" style="padding: 20px;">
                <div class="dao-setting-item">
                  <div class="dao-setting-label">请选择创建方式</div>
                </div>
                <div class="dao-setting-item">
                  <div
                    class="box"
                    :class="selectState === 1 ? 'selected' : ''"
                    @click="selectFirst"
                  >
                    <svg class="icon icon-size">
                      <use :xlink:href="`#icon_file-text`"></use>
                    </svg>
                    <div :class="selectState === 1 ? 'circle' : ''">
                      <div class="hook"></div>
                    </div>
                    <div class="icon-title">使用表单创建</div>
                    <div class="icon-desc">您可以使用表单进行创建实例</div>
                  </div>
                </div>
                <div class="dao-setting-item">
                  <div
                    class="box"
                    :class="selectState === 2 ? 'selected' : ''"
                    @click="selectSecond"
                  >
                    <svg class="icon icon-size">
                      <use :xlink:href="`#icon_file-code`"></use>
                    </svg>
                    <div :class="selectState === 2 ? 'circle' : ''">
                      <div class="hook"></div>
                    </div>
                    <div class="icon-title">使用 YAML 创建</div>
                    <div class="icon-desc">您可以编辑 YAML 进行创建实例</div>
                  </div>
                </div>
              </div>
            </div>
            <div slot="footer">
              <button class="dao-btn ghost" @click="closeCreate">取消</button>
              <button class="dao-btn blue" @click="creatExample">继续</button>
            </div>
          </dao-dialog>
          <dao-dialog
            :visible.sync="configDelete"
            :header="`确定要删除版本吗？`"
          >
            <div class="dao-setting-layout">
              <div class="dao-setting-section" style="padding: 20px;">
                <div class="dao-setting-item">
                  <div class="dao-setting-label dao-name">此操作会删除版本 {{item.version}}，该操作不可撤销。</div>
                </div>
              </div>
            </div>
            <div slot="footer">
              <button class="dao-btn red" @click="deleteChart(item.version)">删除</button>
              <button class="dao-btn ghost" @click="closeDelete">取消</button>
            </div>
          </dao-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./detail.js"></script>

<style lang="scss" src="./detail.scss" scoped></style>
