<template>
  <div>
    <div class="layout-content-header">
      审批记录
    </div>
    <div class="dao-view-main">
      <div class="dao-view-content">
        <x-table
          :data="tCurrentRows"
          :loading="loadings.approvalHistory"
          :filterMethod="filterMethod"
          @refresh="loadApprovalHistroy"
          searchPlaceholder="搜索 申请人"
          emptyText="暂无审批记录"
        >
          <template #default>
            <el-table-column v-slot="{ row }" label="申请者">
              {{ (row.owner || {}).name }}
            </el-table-column>
            <el-table-column v-slot="{ row }" label="申请时间">
              {{ row.created_at | unix_date('YYYY/MM/DD') }}
              {{ row.created_at | unix_date('HH:mm:ss') }}
            </el-table-column>
            <el-table-column show-overflow-tooltip v-slot="{ row }" label="服务/实例">
              {{ (row.service || {}).name }} {{ (row.instance || {}).name }}
            </el-table-column>
            <el-table-column show-overflow-tooltip v-slot="{ row }" label="规格">
              {{ (row.plan || {}).name }}
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              v-slot="{ row: item }"
              label="审批结果"
              width="100px"
            >
              <div class="text-success" v-if="item.process_status === APPROVAL_PROCESS_DONE">
                <span>同意</span>
              </div>
              <div class="text-danger" v-if="item.process_status === APPROVAL_PROCESS_REJECTED">
                <span>拒绝</span>
              </div>
              <div class="text-danger" v-if="item.process_status === APPROVAL_PROCESS_CANCEL">
                <span>撤销</span>
              </div>
              <div class="text-info" v-if="item.process_status === APPROVAL_PROCESS_PENDING">
                <span>处理中</span>
              </div>
            </el-table-column>
          </template>
        </x-table>
      </div>
    </div>
  </div>
</template>

<script src="./approval-history.js"></script>
