<template>
  <div>
    <div class="layout-content-header">
      设置
    </div>
    <div class="dao-view-main">
      <div class="dao-view-sidebar">
        <div class="dao-list-group-container">
          <ul class="dao-list-group">
            <router-link
              class="dao-list-item"
              v-for="tab in TABS"
              tag="li"
              :key="tab.name"
              :hidden='!tab.hidden'
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
          <ul class="dao-list-group">
            <router-link
              class="dao-list-item"
              v-for="tab in OTHERS"
              tag="li"
              :key="tab.name"
              :to="tab.to"
              :hidden='!tab.hidden'
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
    const assets = this.$can('platform.settings.assets');
    const TABS = {
      HOME: {
        name: '首页编辑',
        to: { name: 'manage.preference.home' },
        hidden: assets,
      },
      APPEARANCE: {
        name: '外观定制',
        to: { name: 'manage.preference.appearance' },
        hidden: assets,
      },
      APPSTORE: {
        name: '应用商店定制',
        to: { name: 'manage.preference.appstore' },
        hidden: assets,
      },
      HELP: {
        name: '帮助信息设置',
        to: { name: 'manage.preference.help-info-config' },
        hidden: assets,
      },
    };
    const OTHERS = {
      SSO: {
        name: 'SSO 认证',
        to: { name: 'manage.preference.sso' },
        hidden: this.$can('platform.settings.third-party'),
      },
    };
    return {
      TABS,
      OTHERS,
      content: TABS.HOME.name,
    };
  },
  created() {
    if (!this.$can('platform.settings.assets')) {
      this.$router.push({ name: 'manage.preference.sso' });
    }
  },
};
</script>
