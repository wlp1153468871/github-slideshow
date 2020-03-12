<template>
  <div>
    <circle-loading v-if="loadings.page"></circle-loading>
    <template v-else>
      <resource-header :resource="resource">

        <template #status v-if="status === 'approving'">
          <labels highLight :labels="{'状态': '审批中'}"></labels>
        </template>
        <template #labels>
          <labels :labels="service.metadata.labels || {}"></labels>
        </template>

        <template #action-buttons>
          <dao-dropdown
            v-if="$can('service.update', 'service') || $can('service.delete', 'service')"
            trigger="click"
            :append-to-body="true"
            placement="bottom-end">
            <button class="dao-btn ghosthas-icon">
              操作
              <svg class="icon">
                <use xlink:href="#icon_caret-down"></use>
              </svg>
            </button>

            <dao-dropdown-menu slot="list">
              <dao-dropdown-item
                v-if="$can('service.update', 'service')"
                @click="openUpdateDialog">
                <span>更新</span>
              </dao-dropdown-item>
              <dao-dropdown-item
                v-if="$can('service.delete', 'service')"
                @click="ensureRemove"
                class="dao-dropdown-item-red dao-dropdown-item-hover-red">
                <span>删除</span>
              </dao-dropdown-item>
            </dao-dropdown-menu>
          </dao-dropdown>
          <button
            class="dao-btn csp-table-update-btn"
            @click="init"
            style="margin-left: 10px">
            <svg class="icon">
              <use xlink:href="#icon_update"></use>
            </svg>
          </button>

        </template>
      </resource-header>
      <el-tabs v-model="activeTab">
        <el-tab-pane
          :label="TABS.OVERVIEW.label"
          :name="TABS.OVERVIEW.name">
          <service-overview-panel
            :service="service"
            :ingresses="ingresses"
            :routes="routes"
          >
          </service-overview-panel>
        </el-tab-pane>

        <el-tab-pane
          :label="TABS.POD.label"
          :name="TABS.POD.name">
          <pod-table
            :active-pods="podsWithEndpoints"
            :canSelect="true"
            :pods="pods"
            :loading="loadings.pod"
            @remove="ensureRemovePods"
            @refresh="getPods">
          </pod-table>
        </el-tab-pane>

        <el-tab-pane
          :label="TABS.EVENT.label"
          :name="TABS.EVENT.name">
          <events-table
            v-if="activeTab === TABS.EVENT.name"
            :events="events">
          </events-table>
        </el-tab-pane>
      </el-tabs>
    </template>

    <edit-yaml-dialog
      :value="service"
      :visible.sync="dialogs.update"
      @update="updateService">
    </edit-yaml-dialog>
  </div>
</template>

<script src="./_service.js">
</script>

<style src="./_service.scss" lang="scss">
</style>
