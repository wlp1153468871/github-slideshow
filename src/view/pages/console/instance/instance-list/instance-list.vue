<template>
  <div>
    <div v-if="!serviceId">
      <div class="dao-view-main">
        <div class="dao-view-content">
          <div class="dao-setting-layout">
            <div class="empty-state permission-deny">
              <div class="empty-state-title">
                <svg><use xlink:href="#icon_connect-msg"></use></svg>
              </div>
              <div class="empty-state-message">
                <p>对不起, 该服务还未在 {{ zone.name }} 中上架。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="serviceId">
      <resource-header :selfDefined="true" :resource="resource"> </resource-header>
      <div class="dao-view-main">
        <x-table
          :loading="loadings.instances"
          :data="rows"
          @refresh="loadInstances"
          :filter-method="filterMethod"
          style="width: 100%;"
        >
          <template #operation>
            <button
              class="dao-btn blue has-icon"
              :disabled="loadings.instances || isZoneSyncing || isDeleted"
              v-if="$can('serviceBroker.create')"
              @click="deployService"
            >
              <svg class="icon">
                <use xlink:href="#icon_plus-circled"></use>
              </svg>
              <span class="text">创建实例</span>
            </button>
          </template>
          <el-table-column prop="name" sortable label="实例">
            <template slot-scope="{ row: instances }">
              <a href="javascript:void(0)" @click="gotoDetail(instances)">
                {{ instances.name }}
              </a>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间" :show-overflow-tooltip="true">
            <template slot-scope="{ row: instances }">
              {{ instances.created_at | unix_date }}
            </template>
          </el-table-column>
          <el-table-column prop="owner" label="创建者" :show-overflow-tooltip="true">
            <template slot-scope="{ row: instances }">
              {{ instances.owner.name }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="{ row: instances }">
              <x-table-status
                :row="instances"
                :other="other"
                :text="renderStatus(instances.status)"
              >
              </x-table-status>
            </template>
          </el-table-column>
          <el-table-column
            v-if="$can('serviceBroker.delete')"
            fixed="right"
            label=""
            align="center"
            header-align="center"
            width="80"
          >
            <template slot-scope="{ row: instances }">
              <el-button
                type="text"
                :disabled="disableDelete(instances)"
                @click="ensureRemove(instances)"
                >删除
              </el-button>
            </template>
            <!-- <template slot-scope="{ row: instances }">
              <el-dropdown @command="handleOperate($event, instances)" trigger="click">
                <span>
                  <svg class="icon dropdown-trigger">
                    <use xlink:href="#icon_more"></use>
                  </svg>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    class="dropdown-item-error"
                    v-if="$can('serviceBroker.delete')"
                    :disabled="disableDelete(instances)"
                    command="delete"
                    icon="el-icon-delete"
                  >
                    删除 - 01
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template> -->
          </el-table-column>
        </x-table>
      </div>
    </div>

    <error-info-dialog
      :text="selectedInstanceInfo"
      :visible="dialogConfigs.errorInfo.visible"
      @close="dialogConfigs.errorInfo.visible = false"
    >
    </error-info-dialog>
  </div>
</template>

<script src="./instance-list.js"></script>
