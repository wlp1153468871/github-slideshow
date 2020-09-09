<template>
  <div id="servicedetail">
    <div class="header">
      <breadcrumb
        :links="[
          { text: '服务', route: { path: '/console/appstore/view' } },
          { text: `实例详情(${instanceInfo.name})` },
        ]"
      >
      </breadcrumb>
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
          <svg class="icon" :class="stateClass">
            <use :xlink:href="`#icon_status-dot-small`"></use>
          </svg>
          {{instanceInfo.status | ops_status }}
        </div>
        <div class="title1">类型:</div>
        <div class="title-desc-name">{{appInfo.appType}}</div>
        <div class="title1">创建于:</div>
        <div class="title-desc-name">
          {{ instanceInfo.createdAt | unix_date('YYYY-MM-DD HH:mm:ss') }}
        </div>
      </div>
      <span class="dao-btn-group select-btn">
        <dao-dropdown
          trigger="click"
          :append-to-body="true"
          placement="bottom-start"
          v-if="appInfo.ownerId === user.id"
        >
          <button class="dao-btn has-icons" style="width: 98px">
            <span class="text">更多操作</span>
            <svg class="icon"><use xlink:href="#icon_down-arrow"></use></svg>
          </button>
          <dao-dropdown-menu slot="list" style="min-width: 120px;">
            <dao-dropdown-item @click="linktoForm()">
              <span>使用表单更新</span>
            </dao-dropdown-item>
            <dao-dropdown-item @click="linktoYamlForm()">
              <span>使用YAML更新</span>
            </dao-dropdown-item>
            <dao-dropdown-item @click="deleteInstance()">
              <span style="color: red;">删除</span>
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
          <div class="c-title">实例信息</div>
          <marked :text="instanceInfo.notes"></marked>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Deployment" name="thrid">
        <deployment-panel :deployments="resources.Deployment"></deployment-panel>
      </el-tab-pane>
      <el-tab-pane label="Service" name="fouth">
        <service-panel :services="resources.Service"></service-panel>
      </el-tab-pane>
      <el-tab-pane label="Ingress" name="fifth">
        <ingress-panel :ingresses="resources.Ingress"></ingress-panel>
      </el-tab-pane>
      <el-tab-pane label="Pod" name="sixth">
        <pod-table :can-refresh="false" :pods="resources.Pod" :loading="loading.resources">
        </pod-table>
      </el-tab-pane>
      <el-tab-pane label="Config Map" name="seventh">
        <config-panel :config-maps="resources.ConfigMap">
        </config-panel>
      </el-tab-pane>
      <el-tab-pane label="PVC" name="eighth">
        <pvc-table :pvcs="resources.PersistentVolumeClaim" :loading="loading.resources"></pvc-table>
      </el-tab-pane>
      <el-tab-pane label="操作记录" name="second">
        <job-panel :jobs="operator"></job-panel>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script src="./instance.js"></script>

<style lang="scss" src="./instance.scss"></style>
