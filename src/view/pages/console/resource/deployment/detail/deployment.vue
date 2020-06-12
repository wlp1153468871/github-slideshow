<template>
  <div class="page-pods">
    <circle-loading v-if="loadings.page"></circle-loading>
    <template v-else>
      <resource-header :resource="resource">
        <template #status v-if="status === 'approving'">
          <labels highLight :labels="{ 状态: '审批中' }"></labels>
        </template>
        <template #labels>
          <labels :labels="deployment.metadata.labels || {}"></labels>
        </template>

        <template
          v-if="$can('deployment.update', 'deployment') || $can('deployment.delete', 'deployment')"
          #action-buttons
        >
          <dao-dropdown trigger="click" :append-to-body="true" placement="bottom-end">
            <button class="dao-btn ghost has-icon">
              操作
              <svg class="icon">
                <use xlink:href="#icon_caret-down"></use>
              </svg>
            </button>

            <dao-dropdown-menu slot="list">
              <dao-dropdown-item
                v-if="$can('deployment.update', 'deployment')"
                @click="updateDeployment"
              >
                <span>更新</span>
              </dao-dropdown-item>
              <dao-dropdown-item
                v-if="$can('deployment.update', 'deployment')"
                @click="restartDeployment"
              >
                <span>重启</span>
              </dao-dropdown-item>
              <dao-dropdown-item
                v-if="$can('deployment.delete', 'deployment')"
                class="dao-dropdown-item-red dao-dropdown-item-hover-red"
                @click="ensureRemove"
              >
                <span>删除</span>
              </dao-dropdown-item>
            </dao-dropdown-menu>
          </dao-dropdown>
          <button class="dao-btn csp-table-update-btn" @click="loadData" style="margin-left: 10px;">
            <svg class="icon">
              <use xlink:href="#icon_update"></use>
            </svg>
          </button>
        </template>
      </resource-header>
      <el-tabs v-model="tab" @tab-click="handleTabClick">
        <el-tab-pane :label="TABS.CONFIGURATION.label" :name="TABS.CONFIGURATION.name" :lazy="true">
          <info-panel
            @refresh="loadData"
            @scale="scale"
            :autoscalers="autoscalers"
            :images-by-docker-reference="imagesByDockerReference"
            :deployment="deployment"
          >
          </info-panel>
        </el-tab-pane>
        <el-tab-pane :label="TABS.PODS.label" :name="TABS.PODS.name">
          <pods-panel> </pods-panel>
        </el-tab-pane>
        <!-- 实时日志 -->
        <el-tab-pane
          lazy
          :label="TABS.LOG.label"
          :name="TABS.LOG.name"
          v-if="$can('pod.container.get')"
        >
          <log-panel v-if="tab === TABS.LOG.name" type="deployment"> </log-panel>
        </el-tab-pane>

        <!-- 历史日志 -->
        <el-tab-pane
          lazy
          :label="TABS.OFFLINE_LOG.label"
          :name="TABS.OFFLINE_LOG.name"
          v-if="$can('pod.container.get')"
        >
          <log-offline-panel type="deployment"> </log-offline-panel>
        </el-tab-pane>
        <el-tab-pane :label="TABS.ENV.label" :name="TABS.ENV.name" :lazy="true">
          <env-panel :deployment="deployment" @envUpdate="onEnvUpdate"> </env-panel>
        </el-tab-pane>
        <el-tab-pane :label="TABS.EVENT.label" :name="TABS.EVENT.name" lazy>
          <events-table
            :loading="loadings.table"
            @refresh="getEvents"
            v-if="tab === TABS.EVENT.name"
            :events="events"
          >
          </events-table>
        </el-tab-pane>
        <el-tab-pane :label="TABS.HISTORY.label" :name="TABS.HISTORY.name" :lazy="true">
          <history-panel :deployment="deployment"></history-panel>
        </el-tab-pane>
        <el-tab-pane
          :label="TABS.OPERATING_DATA.label"
          :name="TABS.OPERATING_DATA.name"
          :lazy="true"
        >
          <operating-data :name="name"></operating-data>
        </el-tab-pane>
        <el-tab-pane
          v-if="pods.length"
          :label="TABS.MONITOR.label"
          :name="TABS.MONITOR.name"
          :lazy="true"
        >
          <monitor-panel v-if="tab === TABS.MONITOR.name" :pods="pods" :name="name">
          </monitor-panel>
        </el-tab-pane>
      </el-tabs>
    </template>
    <edit-yaml-dialog
      :value="deployment"
      :visible.sync="dialogs.view"
      @update="update"
      @cancel="config.view = false"
    >
    </edit-yaml-dialog>
  </div>
</template>

<script src="./_deployment.js"></script>

<style lang="scss" src="./_deployment.scss"></style>
