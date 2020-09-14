<template>
  <div>
    <div class="layout-content-header">
      审批请求
    </div>
    <div class="dao-view-main">
      <div class="dao-view-content">
        <x-table
          :data="rows"
          :loading="loadings.approvalList"
          :filterMethod="filterMethod"
          @refresh="loadApprovalList"
          searchPlaceholder="搜索 申请人"
          emptyText="暂无审批请求"
        >
          <el-table-column v-slot="{ row }" label="申请者">
            {{ (row.owner || {}).name }}
          </el-table-column>
          <el-table-column v-slot="{ row }" label="申请时间">
            {{ row.updated_at | unix_date('YYYY/MM/DD') }}
            {{ row.updated_at | unix_date('HH:mm:ss') }}
          </el-table-column>
          <el-table-column show-overflow-tooltip v-slot="{ row }" label="App/Route/实例">
            {{ (row.service || {}).name }} {{ (row.instance || {}).name }}
          </el-table-column>
          <el-table-column prop="zone_name" label="可用区"> </el-table-column>
          <el-table-column show-overflow-tooltip v-slot="{ row }" label="规格">
            {{ (row.plan || {}).name }}
            <br />
            <a @click="openApprovalDetail(row.approval_id)">详情</a>
          </el-table-column>
          <el-table-column v-slot="{ row: item }" label="" width="56px">
            <dao-dropdown trigger="click" :append-to-body="true" placement="bottom-end">
              <svg class="icon dropdown-trigger">
                <use xlink:href="#icon_more"></use>
              </svg>
              <dao-dropdown-menu slot="list">
                <dao-dropdown-item @click="doAgree(item)">
                  <span class="text">同意</span>
                </dao-dropdown-item>
                <dao-dropdown-item
                  @click="doDisagree(item)"
                  class="dao-dropdown-item-red dao-dropdown-item-hover-red"
                >
                  <span class="text">拒绝</span>
                </dao-dropdown-item>
                <dao-dropdown-item @click="doWithdrawal(item)">
                  <span class="text">撤销</span>
                </dao-dropdown-item>
              </dao-dropdown-menu>
            </dao-dropdown>
          </el-table-column>
        </x-table>
      </div>
    </div>

    <approval-detail-dialog
      :visible.sync="dialogConfigs.approval.visible"
      :approval-id="dialogConfigs.approval.approvalId"
      @close="dialogConfigs.approval.visible = false"
    >
    </approval-detail-dialog>
  </div>
</template>

<script src="./approval-list.js"></script>

<style lang="scss" scoped>
.dao-table {
  .type {
    .badge-span {
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      white-space: nowrap;
    }
  }
}
</style>
