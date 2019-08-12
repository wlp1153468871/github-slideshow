<template>
  <div>
    <div class="layout-content-header bg-white">
      <breadcrumb
        :links="[
          { text: '个人信息' },
      ]">
      </breadcrumb>
    </div>
    <dao-tab class="dao-header-tab-nav">
      <dao-tab-item :heading="TABS.SELF">
        <div class="dao-view-main">
          <div class="dao-view-content">
            <self-panel>
            </self-panel>
          </div>
        </div>
      </dao-tab-item>
    </dao-tab>
  </div>
</template>

<script src="./profile.js"></script>
