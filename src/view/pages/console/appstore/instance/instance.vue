<template>
  <div id="servicedetail">
    <div class="layout-content-header detail-header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="header-text">
        <el-breadcrumb-item
          :to="{ path: '/console/appstore' }"
          class="header-text"
        >
          应用
        </el-breadcrumb-item>
        <el-breadcrumb-item>实例详情({{instanceInfo.name}})</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detail-title">
      <span>
        <img :src="`http://jizhidev.k8s01.ats${appInfo.pictureUrl}`" class="icon-size" v-if="appInfo.pictureId"/>
        <img src="@/assets/images/card-Default.png" class="icon-size"  v-else/>
      </span>
      <div class="title-name">{{instanceInfo.name}}</div>
      <div class="title-desc">
        状态:
        <div class="title-desc-name">
          <svg class="icon" style="color: #25D473">
            <use :xlink:href="`#icon_status-dot-small`"></use>
          </svg>
          {{instanceInfo.status}}
        </div>
        <div class="title1">类型:</div>
        <div class="title-desc-name">{{appInfo.appType}}</div>
        <div class="title1">创建于:</div>
        <div class="title-desc-name">
          {{ instanceInfo.createdAt | unix_date('YYYY/MM/DD HH:mm:ss') }}
        </div>
      </div>
      <span class="dao-btn-group select-btn">
        <dao-dropdown
          trigger="click"
          :append-to-body="true"
          placement="bottom-start"
        >
          <button class="dao-btn has-icons" style="width: 98px">
            <span class="text">更多操作</span>
            <svg class="icon"><use xlink:href="#icon_down-arrow"></use></svg>
          </button>
          <dao-dropdown-menu slot="list" style="min-width: 120px;">
            <dao-dropdown-item style="margin-left: 10px">
              <span @click="linktoForm()">使用表单更新</span>
            </dao-dropdown-item>
            <dao-dropdown-item style="margin-left: 10px">
              <span @click="linktoYamlForm()">使用YAML更新</span>
            </dao-dropdown-item>
            <dao-dropdown-item style="margin-left: 10px">
              <span style="color: red;" @click="deleteInstance()">删除</span>
            </dao-dropdown-item>
          </dao-dropdown-menu>
        </dao-dropdown>
      </span>
    </div>
    <el-tabs v-model="activeName" style="position:relative;">
      <el-tab-pane label="基本属性" name="first">
        <div class="container1">
          <div class="c-title">基本属性</div>
          <div class="info-title1-layout">
            <div class="info-title">租户</div>
            <div class="info-desc">{{this.space.organization.name}}</div>
          </div>
          <div class="info-title1-layout" style="float: right;">
            <div class="info-title">项目组</div>
            <div class="info-desc">{{this.space.name}}</div>
          </div>
          <div class="info-title2-layout">
            <div class="info-title">创建者</div>
            <div class="info-desc">{{instanceInfo.ownerName}}</div>
          </div>
          <div class="info-title2-layout"  style="float: right;">
            <div class="info-title">可用区</div>
            <div class="info-desc">{{this.zone.name}}</div>
          </div>
          <div class="info-title2-layout">
            <div class="info-title">Chart 版本</div>
            <div class="info-desc">{{instanceInfo.chartVersion}}</div>
          </div>
        </div>
        <div class="container2">
          <daox-info-table title="操作记录">
            <template slot="operation">
              <a href="javascript:void(0)" @click="toDetail">
                查看更多 >
              </a>
            </template>
            <template slot="content">
              <event-list :jobs="operator"></event-list>
            </template>
          </daox-info-table>
        </div>
        <div class="container1" style="margin-top: 20px;">
          <div class="c-title">Notes</div>
          <div class="title1-desc">{{instanceInfo.notes}}</div>
          <!-- <el-table
            style="width: 100%;padding: 20px;"
            :data="tableDate"
          >
            <el-table-column label="key" prop="key" width="400"></el-table-column>
            <el-table-column label="value" prop="value" width="400"></el-table-column>
          </el-table> -->
        </div>
      </el-tab-pane>
      <el-tab-pane label="操作记录" name="second">
        <div class="Operation">
          <div style="padding: 20px 20px 0 23px;" v-for="(item, index) in operator" :key="index">
            <div style="position: relative; height: 78px;">
              <div class="panel">
                <div class="circle"></div>
                <div class="line"></div>
                <div class="top-line" v-show="index !== 0"></div>
              </div>
              <div class="explain">
                <div class="title" v-if="index === 0">创建实例</div>
                <div class="title" v-else>更新实例</div>
                <div class="date">{{item.started_at | unix_date('YYYY/MM/DD HH:mm:ss')}}</div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Deployment" name="thrid">
        Deployment
        <!-- <dao-input
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
            <el-table-column label="资源名" prop="resourceName" width="400"></el-table-column>
            <el-table-column label="类型" prop="type"></el-table-column>
            <el-table-column label="状态" prop="state"></el-table-column>
            <el-table-column label="创建时间" prop="date"></el-table-column>
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
        </div> -->
      </el-tab-pane>
      <el-tab-pane label="Service" name="fouth">Service</el-tab-pane>
      <el-tab-pane label="Ingress" name="fifth">Ingress</el-tab-pane>
      <el-tab-pane label="Pod" name="sixth">Pod</el-tab-pane>
      <el-tab-pane label="Config Map" name="seventh">Config Map</el-tab-pane>
      <el-tab-pane label="PVC" name="eighth">PVC</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script src="./instance.js"></script>

<style lang="scss" src="./instance.scss"></style>
