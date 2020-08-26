<template>
  <div>
    <div class="layout-content-header">
      可用区设置
    </div>
    <div class="dao-view-main">
      <x-table
        :showRefresh="$can('platform.zone.get')"
        :loading="loadings.zone"
        :data="rows"
        @refresh="loadZones"
        :filter-method="filterMethod"
        style="width: 100%;"
      >
        <template #operation>
          <button
            v-if="$can('platform.zone.create')"
            class="dao-btn has-icon blue"
            @click="deployZone"
          >
            <svg class="icon">
              <use xlink:href="#icon_plus-circled"></use>
            </svg>
            <span class="text">创建可用区</span>
          </button>
        </template>
        <el-table-column prop="name" sortable label="可用区">
          <template slot-scope="{ row: zone }">
            <router-link
              :to="{
                name: 'manage.zone.detail',
                params: { zone: zone.id },
              }"
            >
              {{ zone.name }}
            </router-link>
          </template>
        </el-table-column>
<!--        <el-table-column prop="clusterUrl" label="集群地址">-->
<!--          <template slot-scope="{ row: zone }">-->
<!--            <a :href="zone.clusterUrl" target="_blank">-->
<!--              {{ zone.clusterUrl }}-->
<!--            </a>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="es.esUrl" label="ES 地址" :show-overflow-tooltip="true">-->
<!--          <template slot-scope="{ row: zone }">-->
<!--            {{ zone.es.esUrl || '-' }}-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column prop="available" label="状态">
          <template slot-scope="{ row: zone }">
            <!-- {{ zone.available  }} -->
            <x-table-status :row="zone" :other="other" :text="renderStatus(zone.available)">
            </x-table-status>
          </template>
        </el-table-column>
        <el-table-column prop="short_description" sortable label="创建时间">
          <template slot-scope="{ row: zone }">
            {{ zone.createdAt | unix_date }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="$can('platform.zone.update') || $can('platform.zone.hide')"
          fixed="right"
          label=""
          align="center"
          header-align="center"
          width="80"
        >
          <template slot-scope="{ row: zone }">
            <el-dropdown @command="handleOperate($event, zone)" trigger="click">
              <span>
                <svg class="icon dropdown-trigger">
                  <use xlink:href="#icon_more"></use>
                </svg>
              </span>

              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="$can('platform.zone.update')" command="edit">
                  修改可用区
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="!zone.available && $can('platform.zone.hide')"
                  command="enable"
                >
                  显示
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="zone.available && $can('platform.zone.hide')"
                  command="disable"
                >
                  隐藏
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </x-table>
    </div>
  </div>
</template>

<script src="./zone-list.js"></script>
