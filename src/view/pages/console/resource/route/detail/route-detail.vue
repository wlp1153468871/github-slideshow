<template>
  <div class="page-pods">
    <template v-if="!loadings.page">
      <resource-header :resource="resource" v-if="!isEmpty(route)">
        <template #creationTime>
          创建于{{ route.metadata.creationTimestamp | date }}
        </template>
        <template #status v-if="status === 'approving'">
          <labels highLight :labels="{'状态': '审批中'}"></labels>
        </template>

        <template #labels>
          <labels :labels="route.metadata.labels"></labels>
        </template>

        <template #action-buttons>
          <dao-dropdown
            v-if="$can('delete')"
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
                @click="removeConfirm"
                class="dao-dropdown-item-red dao-dropdown-item-hover-red">
                <span>删除</span>
              </dao-dropdown-item>
            </dao-dropdown-menu>
          </dao-dropdown>

          <button
            class="dao-btn csp-table-update-btn"
            @click="getRoute"
            style="margin-left: 10px">
            <svg class="icon">
              <use xlink:href="#icon_update"></use>
            </svg>
          </button>

        </template>

      </resource-header>
      <el-tabs v-model="tab">
        <el-tab-pane
          :label="TABS.OVERVIEW.label"
          :name="TABS.OVERVIEW.name">
          <overview-panel
            :route="route"
            :information="information"
            :jobs="jobs"
            :services="services"
            @change-tab="tab = $event">
          </overview-panel>
        </el-tab-pane>
        <el-tab-pane
          :label="TABS.RULE.label"
          :name="TABS.RULE.name"
          :lazy="true">
          <rule-panel
            :route="route"
            @update="getRoute">
          </rule-panel>
        </el-tab-pane>
        <el-tab-pane
          :label="TABS.JOBS.label"
          :name="TABS.JOBS.name"
          :lazy="true">
          <jobs-panel :jobs="jobs"></jobs-panel>
        </el-tab-pane>
      </el-tabs>
    </template>

    <circle-loading v-else></circle-loading>

    <edit-yaml-dialog
      :value="route"
      :visible.sync="dialogConfigs.yamlEdit"
      @update="updateByYaml"
      @close="dialogConfigs.yamlEdit = false">
    </edit-yaml-dialog>
  </div>
</template>

<script src="./_route-detail.js">
</script>
