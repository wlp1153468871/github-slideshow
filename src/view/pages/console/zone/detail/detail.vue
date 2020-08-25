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
        <el-breadcrumb-item>可用区详情(上海dev)</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="应用列表" name="first">
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
          <button class="dao-btn blue has-icon" style="margin-left: 10px;">
            <svg class="icon"><use xlink:href="#icon_plus-circled"></use></svg>
            <span class="text">创建应用</span>
          </button>
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
          <el-table-column label="应用名称">
            <template slot-scope="scope">
              <div style="color: #217EF2;">
                {{ scope.row.serviceName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="供应商" prop="supplier" width="100"></el-table-column>
          <el-table-column label="创建者" prop="zone" width="100"></el-table-column>
          <el-table-column label="状态" width="100">
            <template slot-scope="scope">
              <svg class="icon" style="color: #25D473">
                <use :xlink:href="`#icon_status-dot-small`"></use>
              </svg>
              <span>{{ scope.row.state }}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" prop="type"></el-table-column>
          <el-table-column label="版本数" prop="serviceNum" width="80"></el-table-column>
          <el-table-column label="分类" prop="classify"></el-table-column>
          <el-table-column label="创建时间" prop="date"></el-table-column>
          <el-table-column  label="操作" width="60">
            <template>
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
                      <span>下架应用</span>
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
              <div class="info-desc">http://harbor.ats</div>
            </div>
            <div class="info-title2-layout">
              <div class="info-title">仓库名称</div>
              <div class="info-desc">dsp-system</div>
            </div>
            <div class="info-title2-layout">
              <div class="info-title">账户</div>
              <div class="info-desc">admin</div>
            </div>
            <div class="info-title2-layout">
              <div class="info-title">密码</div>
              <div>
                <svg class="icon" style="float: left">
                  <use :xlink:href="`#icon_eye-slash`"></use>
                </svg>
                <div class="info-key">***********</div>
              </div>
            </div>
          </div>
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
    </el-tabs>
  </div>
</template>

<script src="./detail.js"></script>

<style lang="scss" src="./detail.scss"></style>
