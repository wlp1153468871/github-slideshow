<template>
  <div class="page-services">
    <circle-loading v-if="loadings.page"></circle-loading>
    <template v-else>
      <resource-header :resource="resource"></resource-header>
      <div class="dao-view-main">
        <div class="dao-view-content">
          <div class="table-toolbar">
            <div class="table-toolbar-left">
              <button
                class="dao-btn blue has-icon"
                v-if="$can('create')"
                @click="openCreateDialog">
                <svg class="icon">
                  <use xlink:href="#icon_plus-circled"></use>
                </svg>
                <span class="text">创建</span>
              </button>
            </div>
            <div class="table-toolbar-right">
              <dao-input
                v-model="filterKey"
                search
                placeholder="请输入搜索内容">
              </dao-input>
              <button
                class="dao-btn"
                style="margin-left: 10px;"
                @click="getServices">
                <svg class="icon">
                  <use xlink:href="#icon_update"></use>
                </svg>
              </button>
            </div>
          </div>
          <el-table
            v-loading="loadings.table"
            :data="servicesInCurrentPage"
            style="width: 100%">
            <el-table-column
              prop="metadata.name"
              label="名称"
              sortable
              width="180">
              <template slot-scope="{ row: service }">
                <el-table-name-cell
                  :resource="service"
                  routerName="resource.services.detail">
                </el-table-name-cell>
              </template>
            </el-table-column>
            <el-table-column
              prop="spec.clusterIP"
              label="集群地址"
              width="180">
            </el-table-column>
            <el-table-column
              label="外部地址"
              width="250">
              <template slot-scope="{ row: { status: { loadBalancer: { ingress: ingresses } } } }">
                <template
                  v-if="ingresses && ingresses.length">
                  <span
                    :key="index"
                    v-for="(ingress, index) in ingresses">
                    {{ingress.ip}}
                    <span v-if="ingresses.length - 1 !== index">
                      ,
                    </span>
                  </span>
                </template>
                <template v-else>
                  <em>暂无</em>
                </template>
              </template>
            </el-table-column>
            <el-table-column
              prop="spec.ports"
              label="端口"
              width="160">
              <template slot-scope="{ row: { spec: { ports } } }">
                <span v-if="!ports.length"><em>none</em></span>
                <span v-for="(portMapping, index) in ports" :key="index">
                  {{portMapping.port}}/{{portMapping.protocol}}
                  <span v-if="ports.length - 1 !== index">,</span>
                </span>
                <span v-if="ports.length === 5">,
                {{ports[4].port}}/{{ports[4].protocol}}
                </span>
                <span v-if="ports.length > 5">,
                and {{ports.length - 4}} others
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="spec.selector"
              label="标签选择器">
              <template slot-scope="{ row: { spec: { selector } } }">
                <span v-if="!selector"><em>none</em></span>
                <span
                  v-for="(selectorValue, selectorLabel, index) in selector"
                  :key="selectorLabel">
                  {{selectorLabel}}={{selectorValue}}
                  <template v-if="index !== size(selector.length)">,</template>
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="创建时间"
              sortable
              :sort-method="sortStartTime"
              width="200">
              <template slot-scope="{ row: service }">
                {{ service.metadata.creationTimestamp | date }}
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            :disabled="loadings.table"
            :page-sizes="[10,30,50]"
            :page-size.sync="pageSize"
            :current-page.sync="currentPage"
            layout="sizes, prev, pager, next"
            :total="totalPages">
          </el-pagination>
        </div>
      </div>
    </template>

    <edit-yaml-dialog
      :value="formModel"
      :visible="dialogs.create"
      @update="createService"
      @close="dialogs.create = false">
    </edit-yaml-dialog>

  </div>
</template>

<script src="./_service.js">
</script>
