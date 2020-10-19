<template>
  <div id="appdetail" v-if="$can('appstoreApplications.appview')">
    <div class="detail-header">
      <breadcrumb
        :links="[
          { text: '服务', route: { path: '/console/appstore/view' } },
          { text: `服务详情(${appInfo.name})` },
        ]"
      >
      </breadcrumb>
    </div>
    <div v-if="deleteApplication">
      <dao-dialog
        v-if="deleteApplication"
        :visible.sync="deleteApplication"
        header="删除应用模板">
        <div class="body">
          <div>确定删除此应用模板？</div>
          <div>此操作为不可逆操作，请谨慎操作!</div>
        </div>
        <div slot="footer">
          <button class="dao-btn blue" @click="sureApplication">确认</button>
          <button class="dao-btn" @click="applicationCancel">取消</button>
        </div>
      </dao-dialog>
    </div>
    <div class="content_box">
      <div class="left">
        <div class="left-header">
          <div style="padding: 20px;">
            <img :src="getUrl(appInfo.pictureUrl)"
              class="icon-size" v-if="appInfo.pictureId"/>
            <img src="@/assets/images/card-Default.png" class="icon-size" v-else/>
            <div class="header-text">{{appInfo.name}}</div>
          </div>
          <dao-dialog
            :visible.sync="configAdd"
            header="添加版本">
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
                    <div>支持zip, gzip, tgz, tar格式的压缩文件上传</div>
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
        <div class="el_tab_box">
          <el-tabs v-model="activeName">
            <el-tab-pane label="概览" name="first">
              <div class="base-info">
                <div class="title">基本信息</div>
                <div class="desc">
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
              <div class="blank"></div>
              <div class="base-info" v-if="appInfo.content">
                <div class="title">README</div>
                <marked :text="appInfo.content"></marked>
              </div>
            </el-tab-pane>
            <el-tab-pane label="实例" name="second" v-if="$can('appstoreApplications.insview')">
              <dao-input
                search
                @change="updateKey"
                v-model="key"
                placeholder="搜索">
              </dao-input>
              <span style="float: right;" @click="fresh">
                <button class="dao-btn icon-btn" style="margin-left: 10px;">
                  <svg class="icon"><use xlink:href="#icon_cw"></use></svg>
                </button>
              </span>
              <div style="margin-top: 15px;">
                <el-table
                  style="width: 100%;"
                  :data="instanceTable"
                  v-loading="loading.instanceTable"
                >
                  <el-table-column label="实例名称" prop="name" sortable>
                    <template slot-scope="scope">
                      <div style="color: #217EF2;cursor: pointer;" @click="rowClick(scope.row.id)">
                        {{ scope.row.name }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="状态" width="80">
                    <template slot-scope="scope">
                      <svg class="icon" :class="stateClass(scope.row.status)">
                        <use :xlink:href="`#icon_status-dot-small`"></use>
                      </svg>
                      <span>{{ scope.row.status | ops_status }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="Chart 版本" prop="chartVersion" sortable></el-table-column>
                  <el-table-column label="创建者" prop="ownerName"></el-table-column>
                  <el-table-column label="创建时间" prop="createdAt" sortable>
                    <template slot-scope="scope">
                      {{ scope.row.createdAt | unix_date('YYYY-MM-DD HH:mm:ss') }}
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
                          <dao-dropdown-menu
                            slot="list"
                            style="min-width: 120px;"
                            v-if="$can('appstoreApplications.appinstance')"
                          >
                            <dao-dropdown-item @click="linktoForm(scope.row.id)">
                              <span>使用表单更新</span>
                            </dao-dropdown-item>
                            <dao-dropdown-item @click="linktoYamlForm(scope.row.id)">
                              <span>使用 YAML 更新</span>
                            </dao-dropdown-item>
                            <dao-dropdown-item
                              @click="clickDelete(scope.row.id)"
                              class="deleteHover"
                            >
                              <span class="delete">删除111</span>
                            </dao-dropdown-item>
                          </dao-dropdown-menu>
                        </dao-dropdown>
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="footer">
                  <div class="page">共 {{instanceNum()}} 条</div>
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
              <div class="right-desc">({{data.email}})</div>
            </div>
            <div class="right-name">官网链接</div>
            <div class="right-link">
              <a :href="`${item.homeUrl}`">{{item.homeUrl}}</a>
            </div>
            <button
              class="dao-btn blue right-btn"
              @click="showCreate"
              v-if="$can('appstoreApplications.appinstance')">立即创建
            </button>
            <dao-dialog
              :visible.sync="configCreate"
              :header="`创建实例 | ${item.chartName}`"
              @before-close="destoryDialog"
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

  </div>
</template>

<script src="./detail.js"></script>

<style lang="scss" src="./detail.scss"></style>
