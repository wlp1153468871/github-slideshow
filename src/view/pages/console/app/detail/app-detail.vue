<template>
  <div class="app-detail-yaml">
    <loading v-if="loadings.instance"></loading>
    <div v-else>
      <resource-header :resource="resource">
        <template #action-buttons>
          <div class="header-btn-group">
            <save-button
              v-if="$can('update')"
              :saving="loadings.updateByYaml"
              @click="toggleYamlDialog"
              text="编辑 YAML"
            ></save-button>
            <button
              class="dao-btn white"
              @click="loadApplicationInstance">
              <svg class="icon">
                <use xlink:href="#icon_update"></use>
              </svg>
            </button>
          </div>
        </template>
      </resource-header>
      <el-tabs
        class="daox-tabs-control"
        v-model="activeTab"
        @tab-click="switchTab">
        <!-- 预览 -->
        <el-tab-pane :label="TABS.OVERVIEW" :name="TABS.OVERVIEW">
          <overview-panel
            v-if="!loadings.instance"
            :instance="instance"
            :events="events"
            :status="instance.status"
            @goto-jobs-tab="gotoJobsTab">
          </overview-panel>
        </el-tab-pane>

        <!-- 实时日志 -->
        <el-tab-pane
          lazy
          :label="TABS.LOG"
          :name="TABS.LOG">
          <log-panel
            v-if="activeTab === TABS.LOG"
            :containers="resources.Pod"
            :pods="resources.Pod">
          </log-panel>
        </el-tab-pane>

        <!-- 历史日志 -->
        <el-tab-pane :label="TABS.OFFLINE_LOG" :name="TABS.OFFLINE_LOG">
          <log-offline-panel
            :containers="resource.Pod"
            :pods="resources.Pod">
          </log-offline-panel>
        </el-tab-pane>

        <!-- Deployment -->
        <el-tab-pane
          v-if="resources.Deployment"
          :label="TABS.DEPLOYMENT"
          :name="TABS.DEPLOYMENT">
          <deployment-panel :deployments="resources.Deployment">
          </deployment-panel>
        </el-tab-pane>

        <!-- Deployment Config-->
        <el-tab-pane
          v-if="resources.DeploymentConfig"
          :label="TABS.DEPLOYMENT_CONFIG"
          :name="TABS.DEPLOYMENT_CONFIG">
          <deployment-config-panel :deployment-configs="resources.resources">
          </deployment-config-panel>
        </el-tab-pane>

        <!-- 四层负载均衡 -->
        <el-tab-pane :label="TABS.SERVICE" :name="TABS.SERVICE">
          <service-panel
            :services="resources.Service">
          </service-panel>
        </el-tab-pane>

        <!-- 七层负载均衡 -->
        <el-tab-pane :label="TABS.ROUTE" :name="TABS.ROUTE">
          <route-panel
            v-if="resources.Route"
            :routes="resources.Route">
          </route-panel>
        </el-tab-pane>

        <el-tab-pane :label="TABS.INGRESS" :name="TABS.INGRESS">
          <ingress-panel
            v-if="resources.Ingress"
            :ingresses="resources.Ingress">
          </ingress-panel>
        </el-tab-pane>

        <!-- 容器组 -->
        <el-tab-pane :label="TABS.POD" :name="TABS.POD">
          <pod-table
            :can-refresh="false"
            :pods="resources.Pod"
            :loading="loadings.instance">
          </pod-table>
        </el-tab-pane>

        <!--  Config Map  -->
        <el-tab-pane :label="TABS.CONFIGMAP" :name="TABS.CONFIGMAP">
          <config-panel
            :config-maps="resources.ConfigMap"
            :secrets="resources.Secret">
          </config-panel>
        </el-tab-pane>

        <!-- 存储申领 -->
        <el-tab-pane :label="TABS.VOLUME" :name="TABS.VOLUME">
          <pvc-table
            :loading="loadings.instance"
            :pvcs="resources.PersistentVolumeClaim">
          </pvc-table>
        </el-tab-pane>

        <!-- 事件 -->
        <el-tab-pane :label="TABS.EVENT" :name="TABS.EVENT">
          <event-panel
            :instance="instance"
            :zone-id="zoneId">
          </event-panel>
        </el-tab-pane>

        <!-- 操作记录 -->
        <el-tab-pane :label="TABS.JOB" :name="TABS.JOB">
          <job-panel :jobs="events">
          </job-panel>
        </el-tab-pane>

        <!-- 设置 -->
        <el-tab-pane
          :label="TABS.PARAMETER"
          v-if="$can('delete')"
          name="TABS.PARAMETER">
          <parameter-panel :instance="instance">
          </parameter-panel>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- dialog start -->
    <edit-yaml-dialog
      :value="yaml"
      :visible.sync="dialogConfigs.editYaml.visible"
      @update="onUpdateYaml"
      @close="dialogConfigs.editYaml.visible = false">
    </edit-yaml-dialog>
    <!-- dialog end -->
  </div>
</template>

<script src="./app-detail.js">
</script>
