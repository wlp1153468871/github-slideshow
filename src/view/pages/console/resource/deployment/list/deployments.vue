<template>
  <div>
    <circle-loading v-if="loadings.page"></circle-loading>
    <template v-else>
      <resource-header :resource="resource"></resource-header>
      <div class="dao-view-main">
        <div class="dao-view-content">
          <x-table
            :loading="loadings.table"
            :data="deployments"
            :filter-method="filterMethod"
            @refresh="getDeployments">
            <template #operation>
              <button
                class="dao-btn blue has-icon"
                v-if="$can('deployment.create', 'deployment')"
                :disabled="loadings.table"
                @click="dialogConfigs.yamlEdit = true"
              >
                <svg class="icon">
                  <use xlink:href="#icon_plus-circled"></use>
                </svg>
                <span class="text">创建</span>
              </button>
            </template>
            <el-table-column prop="metadata.name" label="名称">
              <template slot-scope="{ row: deployment }">
                <el-table-name-cell :resource="deployment" routerName="resource.deployments.detail">
                </el-table-name-cell>
              </template>
            </el-table-column>
            <el-table-column prop="deployment.kubernetes.io/revision" label="最新版本">
              <template slot-scope="{ row: deployment }">
                #{{ deployment | annotation('deployment.kubernetes.io/revision') }}
              </template>
            </el-table-column>
            <el-table-column prop="spec.replicas" label="副本数"> </el-table-column>
            <el-table-column prop="metadata.creationTimestamp" label="创建时间" width="180">
              <template slot-scope="{ row: deployment }">
                {{ deployment.metadata.creationTimestamp | date }}
              </template>
            </el-table-column>
            <el-table-column prop="spec.strategy.type" label="发布策略"> </el-table-column>
          </x-table>
        </div>
      </div>
    </template>

    <edit-yaml-dialog
      :value="template"
      :visible="dialogConfigs.yamlEdit"
      @update="createByYaml"
      @close="dialogConfigs.yamlEdit = false"
    >
    </edit-yaml-dialog>
  </div>
</template>

<script src="./_deployments.js"></script>
