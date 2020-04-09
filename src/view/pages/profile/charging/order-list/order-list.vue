<template>
  <div>
    <div class="dao-view-main">
      <div class="dao-view-content">
        <dao-table-view
          ref="orderTable"
          :rows="rows"
          :config="tConfig"
          @refresh="laodUserOrder"
          @checked-rows-change="onCheckedRowsChange"
          @confirm-pay="confirmPay"
          @confirm-refund="confirmRefund"
        >
          <div slot="tool">
            <dao-select v-model="orgId" style="width: 180px;" placeholder="全部租户">
              <dao-option v-for="item in orgs" :label="item.name" :value="item.id" :key="item.id">
              </dao-option>
            </dao-select>
            <dao-select v-model="spaceId" style="width: 180px;" placeholder="全部项目组">
              <dao-option v-for="item in spaces" :label="item.name" :value="item.id" :key="item.id">
              </dao-option>
            </dao-select>
          </div>
        </dao-table-view>
      </div>
    </div>
    <!-- fixed bottom-panels -->
    <!-- <div class="fixed-bottom-panels" v-show="panelConfigs.visible">
      <dao-panel size="l" class="bottom-body">
        <dao-panel-item heading="实例信息">
          <dao-info-sheet
            style="width: 50%"
            :table="planDetail.table">
          </dao-info-sheet>
        </dao-panel-item>
      </dao-panel>
    </div> -->
  </div>
</template>

<script src="./order-list.js"></script>
