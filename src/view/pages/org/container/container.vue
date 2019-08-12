<template>
  <div class="layout page-org">
    <div class="layout-content">
      <div
        class="dao-tab dao-header-tab-nav nav-between"
        style="width: 100%">
        <div class="dao-tab__header">
          <ul class="dao-tab-nav">
            <li class="dao-tab-nav-item">{{ org.name }}</li>
          </ul>
          <ul class="dao-tab-nav dao-tab-nav-tab">
            <template v-for="tab in TABS">
              <router-link
                v-if="tab.canShow"
                :key="tab.name"
                class="dao-tab-nav-item"
                tag="li"
                :to="tab.to">
                {{ tab.name }}
              </router-link>
            </template>
          </ul>
          <ul class="dao-tab-nav">
          </ul>
        </div>
        <div class="dao-tab__body" style="margin-top: 15px;">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./container.js">
</script>

<style lang="scss">
.page-org {
  .dao-tab-nav-item {
    display: inline-block;
    padding: 10px 15px;
    line-height: 1;
    background: #f5f7fa;
    list-style: none;
    cursor: pointer;
  }
}
</style>
