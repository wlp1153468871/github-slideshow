<template>
  <div>
    <circle-loading v-if="loadings.secret"></circle-loading>

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
                v-if="$can('secret.create')"
                @click="createSecret"
              >
                <svg class="icon">
                  <use xlink:href="#icon_plus-circled"></use>
                </svg>
                <span class="text">创建</span>
              </button>
            </template>

            <el-table-column label="名称" sortable :sort-method="sortName" min-width="150">
              <template slot-scope="{ row: secret }">
                <el-table-name-cell :resource="secret" routerName="resource.secrets.detail">
                </el-table-name-cell>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="标签" min-width="120">
              <template slot-scope="{ row: secret }">
                {{ humanizeLabel(secret) }}
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

<script src="./_secret-list.js"></script>
