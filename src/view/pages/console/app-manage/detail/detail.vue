<template>
  <div id="servicedetail1">
    <div class="layout-content-header detail-header">
      <!-- <div class="header-text">服务 > 服务详情(Nginx)</div> -->
      <el-breadcrumb separator-class="el-icon-arrow-right" class="header-text">
        <el-breadcrumb-item
          :to="{ path: '/console/service' }"
          class="header-text"
        >
          应用管理
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
            <span>下架应用</span>
          </dao-dropdown-item>
          <dao-dropdown-item style="margin-left: 10px">
            <span style="color: red;">删除</span>
          </dao-dropdown-item>
        </dao-dropdown-menu>
      </dao-dropdown>
    </div>
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
            v-model="item"
            size="sm"
            class="select"
          >
            <dao-option
              v-for="item in items"
              :key="item.value"
              :value="item.text"
              :label="item.text">
            </dao-option>
          </dao-select>
          <span class="icon">
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
              :data="tableData"
            >
              <el-table-column label="项目组名" prop="groupName"></el-table-column>
              <el-table-column label="项目组唯一标识符" prop="groupUnique"></el-table-column>
              <el-table-column label="租户名" prop="tenantName"></el-table-column>
              <el-table-column label="租户唯一标识符" prop="tenantUnique"></el-table-column>
              <el-table-column label="添加日期" prop="date"></el-table-column>
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
            :data="tableData1"
          >
            <el-table-column label="实例名" prop="exampleName"></el-table-column>
            <el-table-column label="Chart 版本" prop="chartType" width="100"></el-table-column>
            <el-table-column label="租户/项目组" prop="tenant"></el-table-column>
            <el-table-column label="状态" width="100">
              <template slot-scope="scope">
                <svg class="icon" style="color: #25D473">
                  <use :xlink:href="`#icon_status-dot-small`"></use>
                </svg>
                <span>{{ scope.row.state }}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建者" prop="creator"></el-table-column>
            <el-table-column label="创建日期" prop="date"></el-table-column>
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
