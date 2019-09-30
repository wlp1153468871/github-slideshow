<template>
  <div>
    <circle-loading v-if="loadings.configMap"></circle-loading>
    <template v-if="!loadings.configMap">

      <resource-header :resource="resource">
        <template #creationTime>
          创建于{{ configMap.metadata.creationTimestamp | date }}
        </template>
        <template #status v-if="status === 'approving'">
          <labels highLight :labels="{'状态': '审批中'}"></labels>
        </template>

        <template #labels>
          <labels :labels="configMap.metadata.labels || {}"></labels>
        </template>

        <template #action-buttons>
          <dao-dropdown
            v-if="$can('delete') || $can('update')"
            trigger="click"
            :append-to-body="true"
            placement="bottom-end"
          >
            <button class="dao-btn ghosthas-icon">
              操作
              <svg class="icon">
                <use xlink:href="#icon_caret-down"></use>
              </svg>
            </button>

            <dao-dropdown-menu slot="list">

              <dao-dropdown-item
                v-if="$can('update')"
                @click="dialogConfigs.yamlEdit = true"
              >
                <span>Yaml 更新</span>
              </dao-dropdown-item>

              <dao-dropdown-item
                v-if="$can('delete') && !objrefs.length"
                @click="removeConfirm"
                class="dao-dropdown-item-red dao-dropdown-item-hover-red"
              >
                <span>删除</span>
              </dao-dropdown-item>
            </dao-dropdown-menu>
          </dao-dropdown>

          <button
            class="dao-btn csp-table-update-btn"
            @click="loadConfigMapDetail"
            style="margin-left: 10px"
          >
            <svg class="icon">
              <use xlink:href="#icon_update"></use>
            </svg>
          </button>
        </template>
      </resource-header>

      <el-tabs v-model="activeName">
        <el-tab-pane
          :label="TABS.OVERVIEW"
          :name="TABS.OVERVIEW"
        >

          <d-alert
            v-if="objrefs.length"
            :show-icon="true"
          >
            <template #message>
              <div style="display: flex">
                该 {{ kind }} 正在被资源
                <resource-link
                  :key="index"
                  v-for="(item, index) in objrefs"
                  :kind="item.kind"
                  :name="item.name"
                >
                </resource-link>
                &nbsp;所使用，所以您无法删除该 {{ kind }}。
              </div>
            </template>
          </d-alert>

          <labels-table
            :data="data"
            :dialog-title="CONFIG_TITLE_TYPE.DATA"
            @edit="editData"
          >
          </labels-table>

          <labels-table
            :data="labels"
            :dialog-title="CONFIG_TITLE_TYPE.LABEL"
            @edit="editLabel"
          >
          </labels-table>

          <labels-table
            :data="annotations"
            :dialog-title="CONFIG_TITLE_TYPE.ANNOTATIONS"
            @edit="editAnnotations"
          >
          </labels-table>

        </el-tab-pane>
        <el-tab-pane
          lazy
          :label="TABS.EVENT"
          :name="TABS.EVENT"
        >

          <event-panel :jobs="events" v-if="events.length"></event-panel>

          <empty-state v-else></empty-state>

        </el-tab-pane>
      </el-tabs>
    </template>

    <edit-yaml-dialog
      :value="configMap"
      :visible.sync="dialogConfigs.yamlEdit"
      @update="updateByYaml"
    >
    </edit-yaml-dialog>
  </div>
</template>

<script src="./_config-map-detail.js">
</script>
