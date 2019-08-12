<template>
  <div>
    <div class="layout-content-header">
      审批请求
    </div>
    <div class="dao-view-main">
      <div class="dao-view-content">
        <div class="dao-table-container">
          <div class="dao-table-main">
            <table class="dao-table slat">
              <thead>
              <tr>
                <th class="name th-name">
                  <svg class="icon">
                    <use xlink:href="#icon_user"></use>
                  </svg>
                  <span>申请者</span>
                </th>
                <th class="time">
                  <svg class="icon">
                    <use xlink:href="#icon_calendar"></use>
                  </svg>
                  <span>申请时间</span>
                </th>
                <th class="type">
                  <svg class="icon">
                    <use xlink:href="#icon_stack-small"></use>
                  </svg>
                  <span>App/Route/实例</span>
                </th>
                <th class="type">
                  <svg class="icon">
                    <use xlink:href="#icon_globe-alt"></use>
                  </svg>
                  <span>可用区</span>
                </th>
                <th class="plan">
                  <svg class="icon">
                    <use xlink:href="#icon_maintenance"></use>
                  </svg>
                  <span>规格</span>
                </th>
                <th class=""></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in tCurrentRows" :key="item[tTrackBy]">
                <!-- approver -->
                <td class="name td-name">
                  {{ (item.owner || {}).name }}
                </td>
                <!-- create time -->
                <td class="time">
                  <div class="item-logo-text" style="overflow:inherit">
                    <div class="item-major">
                      {{ item.updated_at | unix_date('YYYY/MM/DD') }}
                    </div>
                    <div class="item-minor">
                      <div class="badge-span">
                        {{ item.updated_at | unix_date('HH:mm:ss') }}
                      </div>
                    </div>
                  </div>
                </td>
                <!-- service spec -->
                <td class="type">
                  <div class="item-logo-text" style="overflow:inherit">
                    <div class="item-major">
                      <div>
                        {{ (item.service || {}).name }}
                      </div>
                    </div>
                    <div class="item-minor">
                      <div class="badge-span">
                        {{ (item.instance || {}).name }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="type">
                  {{ item.zone_name }}
                </td>
                <td class="plan">
                  {{ (item.plan || {}).name }}
                  <br />
                  <a @click="openApprovalDetail(item.approval_id)">详情</a>
                </td>
                <!-- operation -->
                <td class="">
                  <dao-dropdown
                    trigger="click"
                    :append-to-body="true"
                    placement="bottom-end">
                    <svg class="icon dropdown-trigger">
                      <use xlink:href="#icon_more"></use>
                    </svg>
                    <dao-dropdown-menu slot="list">
                      <dao-dropdown-item @click="doAgree(item)">
                        <span class="text">同意</span>
                      </dao-dropdown-item>
                      <dao-dropdown-item @click="doDisagree(item)">
                        <span class="text">拒绝</span>
                      </dao-dropdown-item>
                      <dao-dropdown-item @click="doWithdrawal(item)">
                        <span class="text">撤销</span>
                      </dao-dropdown-item>
                    </dao-dropdown-menu>
                  </dao-dropdown>
                </td>
              </tr>
              </tbody>
            </table>
            <empty-state
              v-if="!tCurrentRows.length && !loadings.approvalList"
              title="暂无审批请求">
            </empty-state>
            <loading-state v-if="loadings.approvalList"></loading-state>
            <dao-table-pagination
              :pagination="tPagination"
              @prev="prev"
              @next="next">
            </dao-table-pagination>
          </div>
        </div>
      </div>
    </div>

    <approval-detail-dialog
      :visible.sync="dialogConfigs.approval.visible"
      :approval-id="dialogConfigs.approval.approvalId"
      @close="dialogConfigs.approval.visible = false">
    </approval-detail-dialog>
  </div>
</template>

<script src="./approval-list.js">
</script>

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
