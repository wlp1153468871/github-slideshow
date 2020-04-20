<template>
  <div class="module-manage-service">
    <div class="layout-content-header">
      服务管理
    </div>
    <div class="dao-view-main">
      <x-table
        :showRefresh="$can('platform.serviceBroker.get')"
        :loading="loadings.maps"
        :data="rows"
        :filter-method="filterMethod"
        @refresh="loadService"
        style="width: 100%;"
      >
        <el-table-column prop="name" sortable label="服务名">
          <template slot-scope="{ row: service }">
            <router-link
              :to="{
                name: 'manage.service.detail',
                params: { id: service.id },
              }"
            >
              {{ service.name }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="zone.name" label="可用区">
          <template slot-scope="{ row: service }">
            {{ service.zone.name }}
          </template>
        </el-table-column>
        <el-table-column prop="available" label="状态">
          <template slot-scope="{ row: service }">
            <!-- {{ service.available }} -->
            <x-table-status :row="service" :other="other" :text="renderStatus(service.available)">
            </x-table-status>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="short_description"
          sortable
          label="简单描述"
        >
          <template slot-scope="{ row: service }">
            {{ service.short_description | otherwise }}
          </template>
        </el-table-column>
      </x-table>
    </div>
  </div>
</template>

<script src="./service-list.js"></script>
