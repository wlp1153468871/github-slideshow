<template>
  <div id="zone">
    <div class="layout-content-header zone-header">
      可行区管理 > 上海ocp (可用区名)
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="概览" name="first">概览</el-tab-pane>
      <el-tab-pane label="服务列表" name="second">
        <div>
          状态：
          <dao-select
            v-model="select"
            size="sm"
            style="width: 120px; height: 32px; margin-right: 10px;"
          >
            <dao-option
              v-for="item in items"
              :key="item.value"
              :value="item.value"
              :label="item.text">
            </dao-option>
          </dao-select>
          资源类型：
          <dao-select
            v-model="select"
            size="sm"
            style="width: 160px; height: 32px;"
          >
            <dao-option
              v-for="item in items"
              :key="item.value"
              :value="item.value"
              :label="item.text">
            </dao-option>
          </dao-select>
          <span style="float: right;">
            <dao-input
              search
              placeholder="搜索"
              style="width: 200px; height: 32px;"
            >
            </dao-input>
            <el-button size="mini" style="margin-left: 10px;">
              <span>
                <svg class="icon">
                  <use :xlink:href="`#icon_cw`"></use>
                </svg>
              </span>
            </el-button>
          </span>
        </div>
        <el-table
          style="width: 100%; margin-top: 20px;"
          :data="tableData"
        >
          <el-table-column label="服务名" prop="serviceName"></el-table-column>
          <el-table-column label="可用区" prop="zone"></el-table-column>
          <el-table-column label="供应商" prop="supplier"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <svg class="icon" style="color: #25D473">
                <use :xlink:href="`#icon_status-dot-small`"></use>
              </svg>
              <span>{{ scope.row.state }}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" prop="type"></el-table-column>
          <el-table-column label="服务数" prop="serveicNum"></el-table-column>
          <el-table-column label="分类" prop="classify"></el-table-column>
          <el-table-column label="安装时间" prop="date"></el-table-column>
        </el-table>
        <!-- 暂定样式 -->
        <!-- <el-pagination
          background
          :disabled="loadings.table"
          :page-sizes="[10, 30, 50]"
          :page-size.sync="pageSize"
          :current-page.sync="currentPage"
          layout="sizes, prev, pager, next"
          :total="totalPages"
        >
        </el-pagination> -->
      </el-tab-pane>
      <el-tab-pane label="broker 管理" name="third">
        <!-- 逻辑判断，是否报错 -->
        <div class="error-info">
          <svg class="icon icon-size">
            <use :xlink:href="`#icon_drive`"></use>
          </svg>
          <div class="error-title">无法使用</div>
          <div class="error-desc">对不起，可用区"上海 ocp"的helm repo 无法使用原因：禁用 / {报错信息}}</div>
          <div class="error-link" @click="linkToChart">进一步了解</div>
        </div>
        <!-- 进行逻辑判断，是否显示 -->
        <div  style="display: none;">
          <div class="base-info">
            <div class="info-header">基本信息</div>
            <div class="info-title1-layout">
              <div class="info-title">地址</div>
              <div class="info-desc">http://harbor.ats</div>
            </div>
            <div class="info-title1-layout" style="float: right;">
              <div class="info-title">账户</div>
              <div class="info-desc">admin</div>
            </div>
            <div class="info-title2-layout">
              <div class="info-title">密码</div>
              <svg class="icon">
                <use :xlink:href="`#icon_eye-slash`"></use>
              </svg>
              <span class="info-key">***********</span>
            </div>
            <div class="info-title2-layout" style="float: right;">
              <div class="info-title">项目名</div>
              <div class="info-desc">dsp-system</div>
            </div>
            <div class="info-title2-layout">
              <div class="info-title">push命令</div>
              <div class="info-desc">http://harbor.ats</div>
            </div>
          </div>
          <div style="margin: 20px 0 20px 20px;">
            <button class="dao-btn blue has-icon" @click="showDialog">
              <svg class="icon"><use xlink:href="#icon_push"></use></svg>
              <span class="text">上传 chart 文件</span>
            </button>
            <dao-dialog
              :visible.sync="config.visible"
              header="上传 Chart 文件"
              :footer="config.footer"
            >
              <div class="dao-setting-layout">
                <div class="dao-setting-section" style="padding: 20px;">
                  <div class="dao-setting-item">
                    <div class="dao-setting-label">Chart 文件</div>
                    <div class="dao-setting-content">
                      <!-- action上传的地址需要更改 -->
                      <el-upload
                        class="upload-demo"
                        action="http://baidu.com"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        multiple
                      >
                        <button class="dao-btn">选择文件</button>
                      </el-upload>
                    </div>
                  </div>
                </div>
                <div class="dao-setting-section" style="padding: 20px;">
                  <div class="dao-setting-item">
                    <div class="dao-setting-label">Prov 文件</div>
                    <div class="dao-setting-content">
                      <!-- action上传的地址需要更改 -->
                      <el-upload
                        class="upload-demo"
                        action="http://baidu.com"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        multiple
                      >
                        <button class="dao-btn">选择文件</button>
                      </el-upload>
                    </div>
                  </div>
                </div>
              </div>
            </dao-dialog>
            <span style="float: right;">
              <dao-input
                search
                placeholder="搜索"
                style="width: 200px; height: 32px;"
              >
              </dao-input>
              <el-button size="mini" style="margin-left: 10px;">
                <span>
                  <svg class="icon">
                    <use :xlink:href="`#icon_cw`"></use>
                  </svg>
                </span>
              </el-button>
            </span>
          </div>
          <!-- <el-table
            style="width: 100%;"
            :data="tableData"
          >
            <el-table-column  width="50">
              <template>
                <svg class="icon">
                  <use :xlink:href="`#numeric-input_triangle-up`"></use>
                </svg>
              </template>
            </el-table-column>
            <el-table-column label="名称" prop="serviceName" width="300"></el-table-column>

            <el-table-column label="状态" prop="state" width="169">
              <template slot-scope="scope">
                  <svg class="icon" style="color: #25D473">
                    <use :xlink:href="`#icon_status-dot-small`"></use>
                  </svg>
                <span>{{ scope.row.state }}</span>
              </template>
            </el-table-column>
            <el-table-column label="版本" prop="type" width="169"></el-table-column>
            <el-table-column label="创建时间" prop="date" width="300"></el-table-column>
            <el-table-column width="50">
              <template>
                <svg class="icon">
                  <use :xlink:href="`#icon_more`"></use>
                </svg>
              </template>
            </el-table-column>
          </el-table> -->
          <el-table
            style="width: 100%;"
            :data="tableData"
          >
            <el-table-column type="expand">
              <template>
                <el-table style="width: 100%;" :data="chartData">
                  <el-table-column label="Chart 版本" prop="type" width="300"></el-table-column>
                  <el-table-column label="状态">
                    <template slot-scope="scope">
                      <svg class="icon" style="color: #25D473">
                        <use :xlink:href="`#icon_status-dot-small`"></use>
                      </svg>
                      <span>{{ scope.row.state }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="维护者" prop="defender"></el-table-column>
                  <el-table-column label="创建时间" prop="date"></el-table-column>
                  <el-table-column width="50">
                    <template>
                      <svg class="icon">
                        <use :xlink:href="`#icon_more`"></use>
                      </svg>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column label="名称" prop="serviceName" width="300"></el-table-column>
            <el-table-column label="状态" prop="state" width="169">
              <template slot-scope="scope">
                  <svg class="icon" style="color: #25D473">
                    <use :xlink:href="`#icon_status-dot-small`"></use>
                  </svg>
                <span>{{ scope.row.state }}</span>
              </template>
            </el-table-column>
            <el-table-column label="版本" prop="type" width="169"></el-table-column>
            <el-table-column label="创建时间" prop="date" width="300"></el-table-column>
            <el-table-column width="50">
              <template>
                <svg class="icon">
                  <use :xlink:href="`#icon_more`"></use>
                </svg>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="helm 管理" name="fourth">helm 管理</el-tab-pane>
      <el-tab-pane label="operator 管理" name="fivth">operator 管理</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script src="./zone.js"></script>

<style lang="scss" src="./zone.scss"></style>
