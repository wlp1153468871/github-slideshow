<template>
  <div>
    <circle-loading v-if="loading"></circle-loading>

    <template v-if="!loading">
      <resource-header
        :selfDefined="true"
        :resource="resource">
        <template #creationTime>
          创建于{{ instance.created_at | unix_date }}
        </template>

        <template #status>
          状态: {{ instance.status | instance_status }}
        </template>

        <template #action-buttons>
          <instance-rest-btns
            class="float: left;"
            @click="handleAction"
            :btns="btns">
          </instance-rest-btns>

          <dao-dropdown
            v-if="showOperations"
            trigger="click"
            :append-to-body="true"
            placement="bottom-end">

            <button class="dao-btn ghost has-icon">
              操作
              <svg class="icon">
                <use xlink:href="#icon_caret-down"></use>
              </svg>
            </button>

            <dao-dropdown-menu slot="list">
              <dao-dropdown-item
                @click="openDashboard()"
                v-if="instance.status === INSTANCE_STATUS.RUNNING && dashboards.length">
                <span>控制台</span>
              </dao-dropdown-item>
              <dao-dropdown-item
                v-if="canDelete"
                @click="removeConfirm"
                class="dao-dropdown-item-red dao-dropdown-item-hover-red">
                <span>删除</span>
              </dao-dropdown-item>
            </dao-dropdown-menu>
          </dao-dropdown>
          <button
            class="dao-btn"
            :class="{ loading: loadings.actions && loadings.instance }"
            :disabled="loadings.actions && loadings.instance"
            @click="syncBaseInfo"
            style="margin-left: 10px">
            <svg class="icon">
              <use xlink:href="#icon_update"></use>
            </svg>
          </button>
        </template>
      </resource-header>

      <el-tabs v-model="activeTabName">

        <el-tab-pane :label="TABS.OVERVIEW" :name="TABS.OVERVIEW">
          <overview-panel
            @more="gotoTab"
            :events="events"
            :basic-informations="basicInformations"
            :informations="informations"
            :status="instance.status"
            :loadings="loadings">
          </overview-panel>
        </el-tab-pane>

        <el-tab-pane
          lazy
          :label="TABS.EVENTS"
          :name="TABS.EVENTS">
          <events-panel :jobs="events"></events-panel>
        </el-tab-pane>

        <el-tab-pane
          lazy
          v-if="service.monitor"
          :label="TABS.MONITOR"
          :name="TABS.MONITOR">
          <monitor-panel
            v-if="activeTabName === TABS.MONITOR"
            :instance="instance.name"
            :type="service.services[0].name"
          >
          </monitor-panel>
        </el-tab-pane>
      </el-tabs>
    </template>

  </div>
</template>

<script src="./instance-detail.js">
</script>
