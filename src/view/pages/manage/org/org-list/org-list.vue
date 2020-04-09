<template>
  <div>
    <div class="layout-content-header bg-white">
      租户管理
    </div>
    <div class="dao-view-main">
      <div class="dao-view-content">
        <x-table
          :loading="loadings.orgs"
          :data="rows"
          @refresh="loadOrgs"
          :filter-method="filterMethod"
          style="width: 100%;"
        >
          <template #operation>
            <button class="dao-btn has-icon blue" @click="addOrgDialog()">
              <svg class="icon">
                <use xlink:href="#icon_plus-circled"></use>
              </svg>
              <span class="text">添加租户</span>
            </button>
          </template>
          <el-table-column prop="name" sortable label="租户名">
            <template slot-scope="{ row: org }">
              <router-link
                :to="{
                  name: 'manage.org.detail',
                  params: { org: org.id },
                }"
              >
                {{ org.name }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column prop="short_name" label="唯一标识">
            <template slot-scope="{ row: org }">
              {{ org.short_name }}
            </template>
          </el-table-column>
          <el-table-column prop="description" label="备注" :show-overflow-tooltip="true">
            <template slot-scope="{ row: org }">
              {{ org.description | otherwise }}
            </template>
          </el-table-column>
        </x-table>
      </div>
    </div>
    <add-org-dialog
      :visible="dialogConfigs.addOrg.visible"
      @create="createOrg"
      @close="dialogConfigs.addOrg.visible = false"
    >
    </add-org-dialog>
  </div>
</template>

<script src="./org-list.js"></script>
