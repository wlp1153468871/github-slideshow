<template>
  <div>
    <div class="layout-content-header">
      设置
    </div>
    <div class="dao-view-main">
      <div class="dao-view-sidebar">
        <div class="dao-list-group-container">
          <ul class="dao-list-group">
            <template v-for="tab in TABS">
              <router-link
                v-if="tab.code"
                class="dao-list-item"
                tag="li"
                :key="tab.name"
                :to="tab.to"
                @click="content = tab">
                <div>
                  {{ tab.name }}
                  <span class="icon">
                    <svg><use xlink:href="#icon_caret-right"></use></svg>
                  </span>
                </div>
              </router-link>
            </template>

          </ul>
          <ul class="dao-list-group">
            <router-link
              class="dao-list-item"
              v-for="tab in OTHERS"
              tag="li"
              :key="tab.name"
              :to="tab.to"
              @click="content = tab"
            >
              <div>
                {{ tab.name }}
                <span class="icon">
                  <svg><use xlink:href="#icon_caret-right"></use></svg>
                </span>
              </div>
            </router-link>
          </ul>
        </div>
      </div>
      <div class="dao-view-content with-sidebar">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PreferenceContainer',
  data() {
    const TABS = {
      HOME: {
        name: '首页编辑',
        to: { name: 'manage.preference.home' },
        code: true,
      },
      APPEARANCE: {
        name: '外观定制',
        to: { name: 'manage.preference.appearance' },
        code: true,
      },
      APPSTORE: {
        name: '服务市场定制',
        to: { name: 'manage.preference.appstore' },
        code: this.$can('platform.applications'),
      },
      HELP: {
        name: '帮助信息设置',
        to: { name: 'manage.preference.help-info-config' },
        code: true,
      },
    };
    const OTHERS = {
      SSO: {
        name: 'SSO 认证',
        to: { name: 'manage.preference.sso' },
      },
    };
    return {
      TABS,
      OTHERS,
      content: TABS.HOME.name,
    };
  },
};
</script>
