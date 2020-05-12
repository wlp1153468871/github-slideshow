<template>
  <div class="dao-tab dao-header-tab-nav nav-between">
    <div class="layout-content-header">
      权限角色
    </div>
    <div class="dao-tab__header">
      <!-- <ul class="dao-tab-nav">
        <li class="dao-tab-nav-item">{{ org.name }}</li>
      </ul> -->
      <ul class="dao-tab-nav dao-tab-nav-tab">
        <template v-for="tab in TABS">
          <router-link :key="tab.name" class="dao-tab-nav-item" tag="li" exact :to="tab.to">
            {{ tab.name }}
          </router-link>
        </template>
      </ul>
      <ul class="dao-tab-nav"></ul>
    </div>
    <div class="dao-tab__body" style="margin-top: 15px;">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TenantContainer',

  data() {
    return {
      TABS: [
        { name: '平台角色', to: '/manage/auth/platform' },
        { name: '租户角色', to: '/manage/auth/organization' },
        { name: '项目组角色', to: '/manage/auth/space' },
        { name: 'Openshfit 角色', to: '/manage/auth/zone.ocp' },
        // { name: 'DCE 角色', to: '/manage/auth/zone.dce' },
        { name: 'Kubernetes 角色', to: '/manage/auth/zone.k8s' },
      ],
    };
  },
};
</script>
