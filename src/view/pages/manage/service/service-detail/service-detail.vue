<template>
  <div class="module-manage-service">
    <div class="layout-content-header state-header">
      <div class="header-content-logo">
        <service-logo :src="service.logo_url"></service-logo>
      </div>
      <div class="header-content-title">
        <breadcrumb
          :links="[
            { text: '服务列表', route: { name: 'manage.service.list' } },
            { text: service.name },
        ]">
        </breadcrumb>
        <div class="header-btn-group">
          <button
            class="dao-btn blue"
            :disabled="serviceAvailable"
            @click="confirmStackService()">
            立即上架
          </button>
          <dao-dropdown
            trigger="click"
            :append-to-body="true"
            placement="bottom-end">
            <button class="dao-btn has-icon">
              <span class="text">操作</span>
              <svg class="icon">
                <use xlink:href="#icon_caret-down"></use>
              </svg>
            </button>
            <dao-dropdown-menu slot="list">
              <dao-dropdown-item
                :is-disabled="serviceUnavailable"
                @click="confirmUnStackService()">
                <span>立即下架</span>
              </dao-dropdown-item>
            </dao-dropdown-menu>
          </dao-dropdown>
        </div>
      </div>
      <div class="header-content-status">
        <div class="content-item">
          <span class="label">状态:</span>
          <span class="value">
            <svg
              class="icon"
              :class="{
                'text-success': serviceAvailable,
                'text-undefined': !serviceAvailable
            }">
              <use xlink:href="#icon_status-dot"></use>
            </svg>
            {{ service.available | service_status }}
          </span>
        </div>
      </div>
    </div>

    <dao-tab class="dao-header-tab-nav">
      <dao-tab-item :heading="SIDE_BAR.ZONES">
        <div class="dao-view-main">
          <div class="dao-view-content">
            <zone-panel :service="service">
            </zone-panel>
          </div>
        </div>
      </dao-tab-item>
      <dao-tab-item :heading="SIDE_BAR.SOURCES">
        <div class="dao-view-main">
          <div class="dao-view-content">
            <source-panel v-model="service"></source-panel>
          </div>
        </div>
      </dao-tab-item>
      <dao-tab-item :heading="SIDE_BAR.OVERVIEW">
        <div class="dao-view-content">
          <overview-panel v-model="service"></overview-panel>
        </div>
      </dao-tab-item>
    </dao-tab>
  </div>
</template>

<script src="./service-detail.js">
</script>

<style lang="scss">
@import 'service-detail';
</style>
