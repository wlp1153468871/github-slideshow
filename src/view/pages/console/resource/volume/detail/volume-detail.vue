<template>
  <div class="page-pvc">
    <template v-if="!loadings.page">
      <resource-header :resource="resource" v-if="!isEmpty(volume)">
        <template #creationTime> 创建于{{ volume.metadata.creationTimestamp | date }} </template>

        <template #status>
          状态：
          <status-icon :status="volume.status.phase"></status-icon>
          {{ volume.status.phase }}
          <span v-if="volume.spec.volumeName">
            &nbsp;to volume <strong>{{ volume.spec.volumeName }}</strong>
          </span>
        </template>

        <template #action-buttons>
          <dao-dropdown
            v-if="$can('pvc.delete', 'pvc') || $can('pvc.update', 'pvc')"
            trigger="click"
            :append-to-body="true"
            placement="bottom-end"
          >
            <button class="dao-btn ghost has-icon">
              操作
              <svg class="icon">
                <use xlink:href="#icon_caret-down"></use>
              </svg>
            </button>

            <dao-dropdown-menu slot="list">
              <dao-dropdown-item
                v-if="$can('pvc.update', 'pvc')"
                @click="dialogConfigs.yamlEdit = true"
              >
                <span>Yaml 更新</span>
              </dao-dropdown-item>

              <dao-dropdown-item
                v-if="$can('pvc.delete', 'pvc')"
                @click="removeConfirm"
                class="dao-dropdown-item-red dao-dropdown-item-hover-red"
              >
                <span>删除</span>
              </dao-dropdown-item>
            </dao-dropdown-menu>
          </dao-dropdown>

          <button
            class="dao-btn csp-table-update-btn"
            @click="getVolume"
            style="margin-left: 10px;"
          >
            <svg class="icon">
              <use xlink:href="#icon_update"></use>
            </svg>
          </button>
        </template>
      </resource-header>

      <el-tabs v-model="tab">
        <el-tab-pane :label="TABS.OVERVIEW.label" :name="TABS.OVERVIEW.name">
          <overview-panel
            :pvc="volume"
            :information="information"
            :jobs="jobs"
            :objrefs="objrefs"
            @change-tab="tab = $event"
          >
          </overview-panel>
        </el-tab-pane>
        <el-tab-pane :label="TABS.JOBS.label" :name="TABS.JOBS.name" :lazy="true">
          <jobs-panel :jobs="jobs" :volume="volume"> </jobs-panel>
        </el-tab-pane>
      </el-tabs>
    </template>
    <circle-loading v-else></circle-loading>

    <edit-yaml-dialog
      :value="volume"
      :visible.sync="dialogConfigs.yamlEdit"
      @update="updateByYaml"
      @close="dialogConfigs.yamlEdit = false"
    >
    </edit-yaml-dialog>
  </div>
</template>

<script src="./_volume-detail.js"></script>
