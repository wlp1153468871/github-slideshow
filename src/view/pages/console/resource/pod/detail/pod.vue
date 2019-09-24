<template>
  <div class="page-pod">
    <circle-loading v-if="loading"></circle-loading>

    <template v-if="!loading">
      <resource-header :resource="resource">
        <template #creationTime>
          创建于{{ pod.metadata.creationTimestamp | date }}
        </template>

        <template #labels>
          <labels :labels="pod.metadata.labels || {}"></labels>
        </template>

        <template #action-buttons>
          <dao-dropdown
            trigger="click"
            placement="bottom-end">
            <button class="dao-btn ghost has-icon">
              操作
              <svg class="icon">
                <use xlink:href="#icon_caret-down"></use>
              </svg>
            </button>

            <dao-dropdown-menu slot="list">
              <dao-dropdown-item @click="viewYaml">
                <span>查看 YAML</span>
              </dao-dropdown-item>
              <dao-dropdown-item
                v-if="$can('delete')"
                class="dao-dropdown-item-red dao-dropdown-item-hover-red"
                @click="ensureRemove">
                <span>删除</span>
              </dao-dropdown-item>
            </dao-dropdown-menu>
          </dao-dropdown>
          <button
            class="dao-btn csp-table-update-btn"
            @click="getPod"
            style="margin-left: 10px">
            <svg class="icon">
              <use xlink:href="#icon_update"></use>
            </svg>
          </button>
        </template>
      </resource-header>

      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane
          :label="TABS.OVERVIEW.label"
          :name="TABS.OVERVIEW.name">
          <div class="row">
            <div class="col-sm-6">
              <pod-status-panel :pod="pod"></pod-status-panel>
            </div>
            <div class="col-sm-6">
              <pod-template-panel
                :pod="pod"
                :images-by-docker-reference="imagesByDockerReference"
                :builds="builds"
                :detailed="true">
              </pod-template-panel>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <annotations :annotations="pod.metadata.annotations"></annotations>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane
          :label="TABS.TERMINAL.label"
          :name="TABS.TERMINAL.name"
          lazy>
          <div v-if="noContainersYet" class="empty-state-message">
            <h2>
              该 Pod 没有正在运行的容器
            </h2>
          </div>
          <div v-else>
            <div class="hint-info">
              <svg class="icon">
                <use xlink:href="#icon_info"></use>
              </svg>
              <span>
                When you navigate away from this pod, any open terminal connections will be closed.
                This will kill any foreground processes you started from the&nbsp;terminal.
              </span>
            </div>

            <div class="container-detail">
              <span v-if="pod.spec.containers.length === 1">
                <label>Container:</label>{{pod.spec.containers[0].name}}
              </span>

              <el-select
                v-else
                @change="onTerminalSelectChange"
                size="small"
                filterable
                v-model="selectedTerminalContainer"
                value-key="containerName"
                placeholder="Container Name">
                <el-option
                  v-for="term in containerTerminals"
                  :key="term.containerName"
                  :label="term.containerName"
                  :value="term">
                </el-option>
              </el-select>

              <button
                v-if="pod.metadata.name"
                style="float: right;"
                class="dao-btn blue mini btn-sm"
                @click="dialogs.saveFile = true">下载文件
              </button>

            </div>

            <div
              v-if="activeTab === TABS.TERMINAL.name"
              class="container-terminal-wrapper"
              :class="{ disconnected: selectedTerminalContainer.status === 'disconnected' }">
              <div v-for="(term, index) in containerTerminals" :key="index">
                <container-terminal
                  v-if="term.isUsed"
                  v-show="term.isVisible"
                  :prevent="!activeTab === TABS.TERMINAL.name"
                  :pod="pod"
                  :container="term.containerName"
                  :status.sync="term.status"
                  :autofocus="true">
                </container-terminal>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane
          :label="TABS.REALTIME_LOG.label"
          :name="TABS.REALTIME_LOG.name"
          lazy>
          <pod-log-panel
            v-if="activeTab === TABS.REALTIME_LOG.name"
            :containers="containerTerminals"
            :pod="pod">
          </pod-log-panel>
        </el-tab-pane>

        <el-tab-pane
          :label="TABS.OFFLINE_LOG.label"
          :name="TABS.OFFLINE_LOG.name"
          lazy>
          <pod-log-offline-panel
            v-if="activeTab === TABS.OFFLINE_LOG.name"
            :pod="pod">
          </pod-log-offline-panel>
        </el-tab-pane>

        <el-tab-pane
          :label="TABS.ENV.label"
          :name="TABS.ENV.name"
          lazy>
          <env-editor
            v-if="activeTab === TABS.ENV.name"
            :initEnvs="pod.spec.containers"
            :editable="false"
            lazy>
          </env-editor>
        </el-tab-pane>

        <el-tab-pane
          :label="TABS.EVENT.label"
          :name="TABS.EVENT.name"
          lazy>
          <events-table
            v-if="activeTab === TABS.EVENT.name"
            :events="events">
          </events-table>
        </el-tab-pane>

        <el-tab-pane
          :label="TABS.TERMINAL_HISTORY.label"
          :name="TABS.TERMINAL_HISTORY.name"
          lazy>
          <terminal-history-panel
            v-if="activeTab === TABS.TERMINAL_HISTORY.name"
            :pod="pod">
          </terminal-history-panel>
        </el-tab-pane>
        <el-tab-pane
          :label="TABS.MONITOR.label"
          :name="TABS.MONITOR.name"
          lazy>
          <monitor-panel
            v-if="activeTab === TABS.MONITOR.name"
          >
          </monitor-panel>
        </el-tab-pane>

      </el-tabs>
    </template>

    <edit-yaml-dialog
      read-only
      header="查看 YAML"
      :value="pod"
      :visible.sync="dialogs.view">
    </edit-yaml-dialog>

    <file-save-in-container
      :visible="dialogs.saveFile"
      :pod-template="pod"
      :container="selectedTerminalContainer"
      @close="dialogs.saveFile = false">
    </file-save-in-container>
  </div>
</template>

<script src="./_pod.js">
</script>

<style lang="scss" src="./_pod.scss">
</style>
