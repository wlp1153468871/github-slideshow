<template>
  <div>
    <div class="layout-content-header">
      可用区设置
    </div>
    <!-- <div class="dao-view-main">
      <div class="dao-view-content">
        <dao-table-view
          :rows="rows"
          :config="tConfig"
          :loading="loadings.zone"
          @refresh="loadZones"
          @update-zone="updateZone"
          @confirm-enable="confirmEnable"
          @confirm-disable="confirmDisable">
          <div slot="tool" class="dao-table-view-left-bar">
            <button
              class="dao-btn has-icon blue"
              @click="deployZone">
              <svg class="icon">
                <use xlink:href="#icon_plus-circled"></use>
              </svg>
              <span class="text">创建可用区</span>
            </button>
          </div>
        </dao-table-view>
      </div>
    </div> -->
    <div class="dao-view-main">
      <x-table
        :loading="loadings.zone"
        :data="rows"
        @refresh="loadZones"
        :filter-method="filterMethod"
        style="width: 100%"
      >
        <template #operation>
          <button
            class="dao-btn has-icon blue"
            @click="deployZone">
            <svg class="icon">
              <use xlink:href="#icon_plus-circled"></use>
            </svg>
            <span class="text">创建可用区</span>
          </button>
        </template>
        <el-table-column
          prop="name"
          sortable
          label="可用区">
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
        <el-table-column prop="metadata.name" label="集群地址">
          <template slot-scope="{ row: zone }">
            <a :href="zone.clusterUrl" target="_blank">
              {{ zone.clusterUrl }}
            </a>
          </template>
        </el-table-column>
        <el-table-column
          prop="metadata.name"
          label="ES 地址"
          :show-overflow-tooltip="true">
          <template slot-scope="{ row: zone }">
            {{ zone.es.esUrl || "-" }}
          </template>
        </el-table-column>
        <el-table-column prop="metadata.name" label="状态">
          <template slot-scope="{ row: zone }">
            <!-- {{ zone.available  }} -->
            <x-table-status
              :row="zone"
              :other="other"
              :text="renderStatus(zone.available)">
            </x-table-status>
          </template>
        </el-table-column>
        <el-table-column
          prop="short_description"
          sortable
          label="创建时间"
        >
          <template slot-scope="{ row: zone }">
            {{ zone.createdAt | unix_date }}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label=""
          align="center"
          header-align="center"
          width="80">
          <template slot-scope="{ row: zone}">
            <el-dropdown @command="handleOperate($event, zone)" trigger="click">
              <span>
                <svg class="icon dropdown-trigger">
                  <use xlink:href="#icon_more"></use>
                </svg>
              </span>

              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  command="edit"
                >
                  基础设置
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="!zone.available"
                  command="enable"
                  >
                  显示
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="zone.available"
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

<script src="./zone-list.js">
</script>
