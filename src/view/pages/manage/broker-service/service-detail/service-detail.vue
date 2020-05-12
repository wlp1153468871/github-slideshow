<template>
  <div>
    <div class="layout-content-header state-header">
      <div class="header-content-title">
        <breadcrumb
          :links="[
            { text: '可用区列表', route: { name: 'manage.zone.list' } },
            {
              text: brokerService.zoneName,
              route: {
                name: 'manage.zone.detail',
                params: { zone: brokerService.zoneId },
              },
            },
            { text: brokerService.name },
          ]"
        >
        </breadcrumb>
      </div>
    </div>

    <dao-tab class="dao-header-tab-nav">
      <!-- <dao-tab-item :heading="SIDE_BAR.PLANS">
        <plans-panel
          :quota-dict="quotaDict"
          :quota-units="brokerService.quota_units"
          :service-id="brokerService.id">
        </plans-panel>
      </dao-tab-item> -->
      <dao-tab-item :heading="SIDE_BAR.QUOTA_FIELD">
        <div class="dao-view-main">
          <div class="dao-view-content">
            <quota-field-panel
              :allField="allField"
              :quota-fields="brokerService.quota_units"
              @add-quota="addServiceQuota"
              @remove-quota="removeServiceQuota"
            >
            </quota-field-panel>
          </div>
        </div>
      </dao-tab-item>
    </dao-tab>
  </div>
</template>

<script src="./service-detail.js"></script>
