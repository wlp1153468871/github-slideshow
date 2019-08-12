<template>
  <div>
    <div class="layout-content-header">
      审批记录
    </div>
    <div class="dao-view-main">
      <div class="dao-view-content">
        <div class="dao-table-container">
          <div class="dao-table-main">
            <table class="dao-table slat">
              <thead>
                <tr>
                  <th class="name th-name">
                    <svg class="icon"><use xlink:href="#icon_user"></use></svg>
                    <span>申请者</span>
                  </th>
                  <th class="time">
                    <svg class="icon"><use xlink:href="#icon_calendar"></use></svg>
                    <span>申请时间</span>
                  </th>
                  <th class="type">
                    <svg class="icon"><use xlink:href="#icon_stack-small"></use></svg>
                    <span>服务/实例</span>
                  </th>
                  <th class="plan">
                    <svg class="icon"><use xlink:href="#icon_maintenance"></use></svg>
                    <span>规格</span>
                  </th>
                  <th class="operation">
                    <svg class="icon"><use xlink:href="#icon_clipboard-success"></use></svg>
                    <span>审批结果</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in tCurrentRows" :key="item[tTrackBy]">
                  <td class="name td-name">
                    <span>{{ (item.owner || {}).name }}</span>
                  </td>
                  <td class="time">
                    <div class="item-logo-text">
                      <div class="item-major">
                        {{ item.created_at | unix_date('YYYY/MM/DD') }}
                      </div>
                      <div class="item-minor">
                        <div class="badge-span">
                          {{ item.created_at | unix_date('HH:mm:ss') }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="type">
                    <div class="item-logo-text">
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
                  <td class="plan">
                    {{ (item.plan || {}).name }}
                  </td>
                  <!-- status -->
                  <td class="operation text-left">
                    <div
                      class="text-success"
                      v-if="item.process_status === APPROVAL_PROCESS_DONE">
                      <span>同意</span>
                    </div>
                    <div
                      class="text-danger"
                      v-if="item.process_status === APPROVAL_PROCESS_REJECTED">
                      <span>拒绝</span>
                    </div>
                    <div
                      class="text-danger"
                      v-if="item.process_status === APPROVAL_PROCESS_CANCEL">
                      <span>撤销</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <empty-state
              v-show="!tCurrentRows.length && !loadings.approvalHistory"
              title="暂无审批记录">
            </empty-state>

            <loading-state v-if="loadings.approvalHistory">
            </loading-state>

            <dao-table-pagination
              :pagination="tPagination"
              @prev="prev"
              @next="next">
            </dao-table-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./approval-history.js"></script>
