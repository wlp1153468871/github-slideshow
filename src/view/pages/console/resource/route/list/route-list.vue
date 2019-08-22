<template>
  <div>
    <template v-if="!loadings.page">

      <resource-header :resource="resource"></resource-header>

      <div class="dao-view-main">
        <div class="dao-view-content">
          <div class="table-toolbar">
            <div class="table-toolbar-left">
              <button
                class="dao-btn blue has-icon"
                v-if="$can('create')"
                @click="createRoute()">
                <svg class="icon">
                  <use xlink:href="#icon_plus-circled"></use>
                </svg>
                <span class="text">创建</span>
              </button>
            </div>
            <div class="table-toolbar-right">
              <div>
                <dao-input
                  v-model="filterKey"
                  search
                  placeholder="请输入搜索内容">
                </dao-input>
                <button
                  class="dao-btn"
                  style="margin-left: 10px;"
                  :disabled="loadings.table"
                  @click="getRoutes">
                  <svg class="icon">
                    <use xlink:href="#icon_update"></use>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <el-table
            v-loading="loadings.table"
            :data="routesInCurrentPage">
            <el-table-column
              :label="'name' | translate"
              sortable
              :sort-method="sortName">
              <template slot-scope="{ row: route }">
                <el-table-name-cell
                  :resource="route"
                  routerName="resource.routes.detail">
                </el-table-name-cell>
                <route-warnings
                  :key="route.metadata.name"
                  v-if="route.spec.to.kind !== 'Service' || services"
                  :route="route"
                  :services="services">
                </route-warnings>
              </template>
            </el-table-column>
            <el-table-column :label="'hostname' | translate">
              <template slot-scope="scope">
                <span v-if="isWebRouteFilter(scope.row)">
                  <a :href="scope.row | route_web_url" target="_blank">
                    {{scope.row | route_label}}
                    <svg class="icon">
                      <use xlink:href="#icon_link"></use>
                    </svg>
                  </a>
                </span>
                <span v-if="!isWebRouteFilter(scope.row)">
                  {{scope.row | route_label}}
                </span>
                <dao-popover
                  v-if="!scope.row.status.ingress"
                  :content="routeIngressInfo"
                  trigger="hover">
                  <span style="cursor: help; padding-left: 5px;">
                    <status-icon :status="'Pending'"></status-icon>
                    <span class="sr-only">Pending</span>
                  </span>
                </dao-popover>
              </template>
            </el-table-column>
            <el-table-column label="Service">
              <template slot-scope="{ row: route }">
                <span v-if="route.spec.to.kind !== 'Service'">
                  {{ route.spec.to.kind }}: {{ route.spec.to.name }}
                </span>
                <template v-else>
                  <resource-link
                    v-if="hasServiceBeenDeleted(route.spec.to.name)"
                    kind="Service"
                    :name="route.spec.to.name">
                  </resource-link>
                  <template v-else>
                    <span>{{ route.spec.to.name }}</span>
                    <el-popover
                      placement="top-start"
                      width="300"
                      trigger="hover">
                      <span v-html="serviceDeletedMessage(route.spec.to.name)"></span>
                      <span slot="reference">
                      <svg class="icon" style="color: #f1483f; margin-left: 5px;">
                        <use xlink:href="#icon_close"></use>
                      </svg>
                    </span>
                    </el-popover>
                  </template>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="Termination Type">
              <template slot-scope="scope">
                <span v-if="scope.row.spec.tls">
                  {{scope.row.spec.tls.termination | humanize_tls_termination}}
                  <span v-if="!scope.row.spec.tls.termination">&nbsp;</span>
                </span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column :label="'targetPort' | translate">
              <template slot-scope="{ row: route }">
                <span v-if="route.spec.port && route.spec.port.targetPort">
                  <span v-if="route.spec.to.kind !== 'Service'">
                    {{route.spec.port.targetPort}}
                  </span>
                  <el-popover
                    v-else-if="route.routeTargetPortMapping"
                    placement="top-start"
                    width="200"
                    trigger="hover"
                    :content="route.routeTargetPortMapping">
                    <span
                      style="cursor: pointer;"
                      slot="reference">{{route.spec.port.targetPort}}
                    </span>
                  </el-popover>
                  <span v-else>{{route.spec.port.targetPort}}</span>
                </span>
                <span v-else>-</span>
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

    <circle-loading v-else></circle-loading>
  </div>
</template>

<script src="./route-list.js">
</script>
