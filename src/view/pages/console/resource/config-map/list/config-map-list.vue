<template>
  <div>
    <circle-loading v-if="loadings.configMap"></circle-loading>

    <template v-else>
      <resource-header :resource="resource"></resource-header>

      <div class="dao-view-main">
        <div class="dao-view-content">
          <x-table
            :data="rows"
            :filter-method="filterMethod"
            :loading="loadings.table"
            @refresh="loadInstances"
          >
            <template #operation>
              <button
                class="dao-btn blue has-icon"
                v-if="$can('configMap.create')"
                @click="createConfigMap"
              >
                <svg class="icon">
                  <use xlink:href="#icon_plus-circled"></use>
                </svg>
                <span class="text">创建</span>
              </button>
            </template>

            <el-table-column label="名称" sortable :sort-method="sortName" min-width="150">
              <template slot-scope="{ row: configMap }">
                <el-table-name-cell :resource="configMap" routerName="resource.configmaps.detail">
                </el-table-name-cell>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="标签" min-width="120">
              <template slot-scope="{ row: configMap }">
                {{ humanizeLabel(configMap) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="metadata.creationTimestamp"
              label="创建时间"
              sortable
              :formatter="dateFormat"
              width="200"
            >
            </el-table-column>

            <el-table-column
              v-if="$can('configMap.update') || $can('configMap.delete')"
              fixed="right"
              label="操作"
              align="center"
              header-align="center"
              width="80"
            >
              <template slot-scope="{ row: configMap }">
                <el-dropdown @command="handleOperate($event, configMap)">
                  <span>
                    <svg class="icon dropdown-trigger">
                      <use xlink:href="#icon_more"></use>
                    </svg>
                  </span>

                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      command="edit"
                      v-if="$can('configMap.update')"
                      :disabled="disableDelete(configMap)"
                      icon="el-icon-edit-outline"
                    >
                      编辑
                    </el-dropdown-item>
                    <el-dropdown-item
                      class="dropdown-item-error"
                      v-if="$can('configMap.delete')"
                      :disabled="disableDelete(configMap)"
                      command="delete"
                      icon="el-icon-delete"
                    >
                      删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </x-table>
        </div>
      </div>
    </template>

    <error-info-dialog
      :text="selectedInstanceInfo"
      :visible="dialogConfigs.errorInfo.visible"
      @close="dialogConfigs.errorInfo.visible = false"
    >
    </error-info-dialog>
  </div>
</template>

<script src="./_config-map-list.js"></script>
