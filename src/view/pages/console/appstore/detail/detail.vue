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
        <el-breadcrumb-item>应用详情(Nginx)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="left">
      <div class="left-header">
        <div style="padding: 20px;">
          <svg class="icon icon-size">
            <use :xlink:href="`#color-icon_nginx`"></use>
          </svg>
          <div class="header-text">Nginx</div>

          <!-- 新建的应用才有这部分 -->
          <dao-dropdown
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
                <span style="color: red;">删除</span>
              </dao-dropdown-item>
            </dao-dropdown-menu>
          </dao-dropdown>
        </div>
        <dao-dialog
          :visible.sync="config1.visible"
          header="编辑基本信息"
        >
          <div class="dao-setting-layout">
            <div class="dao-setting-section" style="padding: 20px;">
              <div class="dao-setting-item">
                <div class="dao-setting-label dao-name">实例名称</div>
                <div class="dao-setting-content">
                  <dao-input
                    block
                    style="width: 98%"
                    placeholder="请应用名称">
                  </dao-input>
                </div>
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
                <div class="dao-setting-label dao-name">分类</div>
                <div class="dao-setting-content">
                  <dao-select
                    v-model="select"
                    class="dao-option"
                    size="sm"
                    style="width:98%;height: 32px;"
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
            <button class="dao-btn blue">
              确认
            </button>
          </div>
        </dao-dialog>
        <dao-dialog
          :visible.sync="config2.visible"
          header="添加版本"
        >
          <div class="dao-setting-layout">
            <div class="dao-setting-section" style="padding: 20px;">
              <div class="dao-setting-item">
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
            </div>
          </div>
          <div slot="footer">
            <button class="dao-btn ghost" @click="addClose">
              取消
            </button>
            <button class="dao-btn blue">
              确认
            </button>
          </div>
        </dao-dialog>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="概览" name="first">
          <div class="base-info">
            <div class="title">基本信息</div>
            <div class="desc">
              <div class="desc-title">应用描述</div>
              <div class="desc-text">
                Nginx 是一个高性能的HTTP和反向代理服务器，也是一个 IMP/POP3/SMTP 服务器，因为它的稳定性、丰富的功能集、实例配置文件和低系统资源的消耗而闻名。
              </div>
            </div>
            <div class="app">
                <div class="app-title">应用信息</div>
              <div>
                <div class="app-text-name">服务类型</div>
                <div class="app-text-name">服务类型</div>
                <div class="app-text-desc">网络</div>
                <div class="app-text-desc">Service Broker</div>
              </div>
              <div>
                <div class="app-text-name">服务类型</div>
                <div class="app-text-name">服务类型</div>
                <div class="app-text-desc">网络</div>
                <div class="app-text-desc">Service Broker</div>
              </div>
              <div>
                <div class="app-text-name">服务类型</div>
                <div class="app-text-name">服务类型</div>
                <div class="app-text-desc">网络</div>
                <div class="app-text-desc">Service Broker</div>
              </div>
            </div>
          </div>
          <!-- <div class="blank"></div> -->
          <div class="base-info">
            <div class="title" style="height: 52px;padding: 18px 0 0 0;">Readme</div>
            <div class="title1">
              nginx-ingress
            </div>
            <div class="title1-desc">
              nginx-ingress is an Ingress controller that uses Configuration.
              To use, add the kubernetes.io/ingress.class
              :nginx annotation to your ingress resources.
            </div>
            <div class="title1" style="font-size: 20px;">
              TL; DR;
            </div>
            <div class="title2-desc">
              <div class="title2-text">
                $ helm install helm-repo>/nginx-ingress
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="实例" name="second">
          <dao-input
            search
            placeholder="搜索">
          </dao-input>
          <span style="float: right;">
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
              :data="tableData"
            >
              <el-table-column label="实例名称" prop="exampleName"></el-table-column>
              <el-table-column label="状态" width="100">
                <template slot-scope="scope">
                  <svg class="icon" style="color: #25D473">
                    <use :xlink:href="`#icon_status-dot-small`"></use>
                  </svg>
                  <span>{{ scope.row.state }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Chart 版本" prop="type"></el-table-column>
              <el-table-column label="创建者" prop="creator"></el-table-column>
              <el-table-column label="创建时间" prop="date"></el-table-column>
              <el-table-column  label="操作" width="100">
                <template>
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
                          <span @click="linktoForm">使用表单更新</span>
                        </dao-dropdown-item>
                        <dao-dropdown-item style="margin-left: 10px">
                          <span @click="linktoYamlForm">使用YAML更新</span>
                        </dao-dropdown-item>
                        <dao-dropdown-item style="margin-left: 10px">
                          <span style="color: red;">删除</span>
                        </dao-dropdown-item>
                      </dao-dropdown-menu>
                    </dao-dropdown>
                  </span>
                </template>
              </el-table-column>
            </el-table>
            <div class="footer">
              <div class="page">共 4 项</div>
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
    <div class="right">
      <div class="right-type">Chart 版本:</div>
      <dao-select
        v-model="select"
        size="sm"
        class="right-select"
      >
        <dao-option
          v-for="item in items"
          :key="item.value"
          :value="item.value"
          :label="item.text">
        </dao-option>
      </dao-select>
      <div class="right-name">名称</div>
      <div class="right-desc">nginx-ingress</div>
      <div class="right-name">App版本</div>
      <div class="right-desc">0.25.0</div>
      <div class="right-name">帮助链接</div>
      <div class="right-link">http://nginx.org/en/docs/</div>
      <div class="right-name">帮官网链接</div>
      <div class="right-link">http://nginx.org/</div>
      <button class="dao-btn blue right-btn" @click="showDialog">立即创建</button>
      <dao-dialog
        :visible.sync="config.visible"
        header="创建实例 | Nginx1.9.1"
        :footer="config.footer"
      >
        <div class="dao-setting-layout">
          <div class="dao-setting-section" style="padding: 20px;">
            <div class="dao-setting-item">
              <div class="dao-setting-label">请选择创建方式</div>
            </div>
            <div class="dao-setting-item">
              <div
                class="box"
                :class="this.selectState === 1 ? 'selected' : ''"
                @click="selectFirst"
              >
                <svg class="icon icon-size">
                  <use :xlink:href="`#icon_file-text`"></use>
                </svg>
                <div :class="this.selectState === 1 ? 'circle' : ''">
                  <div class="hook"></div>
                </div>
                <div class="icon-title">使用表单创建</div>
                <div class="icon-desc">您可以使用表单进行创建实例</div>
              </div>
            </div>
            <div class="dao-setting-item">
              <div
                class="box"
                :class="this.selectState === 2 ? 'selected' : ''"
                @click="selectSecond"
              >
                <svg class="icon icon-size">
                  <use :xlink:href="`#icon_file-code`"></use>
                </svg>
                <div :class="this.selectState === 2 ? 'circle' : ''">
                  <div class="hook"></div>
                </div>
                <div class="icon-title">使用 YAML 创建</div>
                <div class="icon-desc">您可以编辑 YAML 进行创建实例</div>
              </div>
            </div>
          </div>
        </div>
        <div slot="footer">
          <button class="dao-btn ghost" @click="close">
            取消
          </button>
          <button class="dao-btn blue" @click="creatExample">
            继续
          </button>
        </div>
      </dao-dialog>
    </div>
  </div>
</template>

<script src="./detail.js"></script>

<style lang="scss" src="./detail.scss" scoped></style>
