<template>
  <div id="zone">
    <div class="layout-content-header zone-header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="header-text">
        <el-breadcrumb-item
          :to="{ path: '/console/zone' }"
          class="header-text"
        >
          可用区管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>可用区详情()</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-tabs v-model="activeName" @tab-click="tabsClick">
      <el-tab-pane label="应用列表" name="first">
        <div class="app-list">
          <div>
              状态：
              <dao-select
                v-model="status"
                size="sm"
                style="width: 120px; height: 32px; margin-right: 10px;"
                @change="changeStatus"
              >
                <dao-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :value="item.value"
                  :label="item.text">
                </dao-option>
              </dao-select>
              资源类型：
              <dao-select
                v-model="type"
                size="sm"
                style="width: 160px; height: 32px;"
              >
                <dao-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :value="item.value"
                  :label="item.text">
                </dao-option>
              </dao-select>
            <button class="dao-btn blue has-icon"
                    style="margin-left: 10px;"
                    @click="handleNewApplication">
              <svg class="icon"><use xlink:href="#icon_plus-circled"></use></svg>
              <span class="text">创建应用</span>
            </button>
          </div>
          <div>
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
          </div>
        </div>
        <el-table
          style="width: 100%; margin-top: 20px;"
          :data="tableData"
        >
          <el-table-column label="应用名称" prop="name">
          </el-table-column>
          <el-table-column label="供应商" prop="provider" width="100"></el-table-column>
          <el-table-column label="创建者" prop="ownerName" width="100"></el-table-column>
          <el-table-column label="状态" width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.available === 1">
                <svg class="icon" style="color: #25D473">
                  <use :xlink:href="`#icon_status-dot-small`"></use>
                </svg>
                <span>已上架</span>
              </div>
              <div v-if="scope.row.available === 0">
                <svg class="icon" style="color: #CCD1D9">
                  <use :xlink:href="`#icon_status-dot-small`"></use>
                </svg>
                <span>已下架</span>
              </div>

            </template>
          </el-table-column>
          <el-table-column label="类型" prop="appType"></el-table-column>
          <el-table-column label="版本数" prop="numVersion" width="80"></el-table-column>
          <el-table-column label="分类" prop="category"></el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="scope">
              {{ scope.row.createdAt | unix_date('YYYY/MM/DD HH:mm:ss') }}
            </template>
          </el-table-column>
          <el-table-column  label="操作" width="60">
            <template slot-scope="scope">
              <span class="dao-btn-group">
                <dao-dropdown
                  trigger="click"
                  :append-to-body="true"
                  placement="right-start"
                >
                  <svg class="icon">
                    <use :xlink:href="`#icon_more`"></use>
                  </svg>
                  <dao-dropdown-menu slot="list" style="min-width: 120px;">
                    <dao-dropdown-item style="margin-left: 10px">
                      <span style="width: 100%;display: inline-block;"
                            v-if="scope.row.available === 1"
                            @click="handleOff(scope.row.id)">下架应用</span>
                      <span style="width: 100%;display: inline-block;"
                            v-if="scope.row.available === 0"
                            @click="handleOn(scope.row.id)">上架应用</span>
                    </dao-dropdown-item>
                    <dao-dropdown-item style="margin-left: 10px" @click="handleClick(scope.row.id)">
                      <span style="color: red;">删除</span>
                    </dao-dropdown-item>
                  </dao-dropdown-menu>
                </dao-dropdown>
              </span>
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
      </el-tab-pane>
      <el-tab-pane label="Chart 管理" name="second">
        <!-- 逻辑判断，是否报错 -->
        <div class="error-info"  style="display: none;">
          <svg class="icon icon-size">
            <use :xlink:href="`#icon_drive`"></use>
          </svg>
          <div class="error-title">无法使用</div>
          <div class="error-desc">对不起，可用区"上海 ocp"的helm repo 无法使用原因：禁用 / {报错信息}}</div>
          <div class="error-link" @click="linkToChart">进一步了解</div>
        </div>
        <!-- 进行逻辑判断，是否显示 -->
        <div>
          <div class="base-info">
            <div class="info-header">基本信息</div>
            <div class="info-title2-layout">
              <div class="info-title">地址</div>
              <div class="info-desc">{{chartBaseList.url}}</div>
            </div>
            <div class="info-title2-layout">
              <div class="info-title">仓库名称</div>
              <div class="info-desc">{{chartBaseList.chart_repo}}</div>
            </div>
            <div class="info-title2-layout">
              <div class="info-title">账户</div>
              <div class="info-desc">{{chartBaseList.username}}</div>
            </div>
            <div class="info-title2-layout">
              <div class="info-title">密码</div>
              <div>
                <svg class="icon" style="float: left;cursor: pointer" @click="showPassword">
                  <use :xlink:href="`#icon_eye-slash`"></use>
                </svg>
                <div v-if="!showPass" class="info-key">***********</div>
                <div v-if="showPass" class="info-key">{{chartBaseList.password}}</div>
              </div>
            </div>
          </div>
          <div class="chart-search">
            <dao-input
              search
              placeholder="搜索"
              class="search"
            >
            </dao-input>
            <span class="fresh">
            <el-button size="mini" style="margin-left: 10px;" >
              <span>
                <svg class="icon">
                  <use :xlink:href="`#icon_cw`"></use>
                </svg>
              </span>
            </el-button>
          </span>
          </div>
          <el-table
            style="width: 100%;"
            :data="chartTableData"
          >
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-table class="in-table"
                          style="width: 100%;"
                          :data="scope.row[scope.row.name]"
                          :header-cell-style="{background:'#fff'}">
                  <el-table-column label="Chart 版本" prop="version" width="200"></el-table-column>
                  <el-table-column label="APP版本" prop="appVersion" width="200"></el-table-column>
                  <el-table-column label="维护者">
                    <template slot-scope="scope">
                      {{ scope.row.maintainers[0].name }}({{scope.row.maintainers.length-1}}others)
                    </template>
                  </el-table-column>
                  <el-table-column label="创建时间" prop="date">
                    <template slot-scope="scope">
                      {{ scope.row.created.split('T')[0] }}
                    </template>
                  </el-table-column>
                  <el-table-column width="50">
                    <template slot-scope="scope">
                      <span class="dao-btn-group">
                        <dao-dropdown
                          trigger="click"
                          :append-to-body="true"
                          placement="right-start"
                        >
                          <svg class="icon">
                            <use :xlink:href="`#icon_more`"></use>
                          </svg>
                          <dao-dropdown-menu slot="list" style="min-width: 120px;">
                            <dao-dropdown-item style="margin-left: 10px">
                              <span style="width: 100%;display: inline-block;"
                                    @click="uploadChart(scope.row.name, scope.row.version)"
                              >下载</span>
                            </dao-dropdown-item>
                            <dao-dropdown-item style="margin-left: 10px">
                              <span style="color: red;"
                                    @click="deleteChartVersion(scope.row.name, scope.row.version)"
                              >删除</span>
                            </dao-dropdown-item>
                          </dao-dropdown-menu>
                        </dao-dropdown>
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column label="名称" prop="name" width="300"></el-table-column>
            <el-table-column label="状态" prop="state" width="200">
              <template slot-scope="scope">
                <div v-if="scope.row.deprecated === false">
                  <svg class="icon" style="color: #25D473">
                    <use :xlink:href="`#icon_status-dot-small`"></use>
                  </svg>
                  <span>正常</span>
                </div>
                <div v-if="scope.row.deprecated === true">
                  <svg class="icon" style="color: #ff0000">
                    <use :xlink:href="`#icon_status-dot-small`"></use>
                  </svg>
                  <span>不推荐使用</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="版本数" prop="total_versions" width="200"></el-table-column>
            <el-table-column label="创建时间">
              <template slot-scope="scope">
                {{ scope.row.created.split('T')[0] }}
              </template>
            </el-table-column>
            <el-table-column width="50">
              <template slot-scope="scope">
                <span class="dao-btn-group">
                <dao-dropdown
                  trigger="click"
                  :append-to-body="true"
                  placement="right-start"
                >
                  <svg class="icon">
                    <use :xlink:href="`#icon_more`"></use>
                  </svg>
                  <dao-dropdown-menu slot="list" style="min-width: 120px;">
                    <dao-dropdown-item style="margin-left: 10px">
                      <span style="color: red;" @click="deleteChartAll(scope.row.name)">删除</span>
                    </dao-dropdown-item>
                  </dao-dropdown-menu>
                </dao-dropdown>
              </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script src="./application-list.js"></script>

<style>
  #zone .el-button--mini{
    padding: 8px 8px;
    margin-top: -5px;
  }
  #zone .el-table__expanded-cell[class*=cell] {
    padding: 20px 0px;
  }
  #zone .in-table .el-table th:not(:last-child)::after{
    border: none;
  }
</style>
<style lang="scss" src="./application-list.scss"></style>
