<template>
  <div class="dao-view-main">
    <div class="dao-view-sidebar">
      <div class="dao-list-group-container">
        <ul class="dao-list-group">
          <li
            class="dao-list-item"
            v-for="tab in TABS"
            :key="tab.name"
            :class="{ active: content === tab.name }"
            @click="content = tab.name"
            v-if="tab.canShow"
          >
            <div>
              {{ tab.name }}
              <span class="icon">
                <svg><use xlink:href="#icon_caret-right"></use></svg>
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="dao-view-content with-sidebar">
      <basic-panel v-if="content === TABS.BASIC.name" :org="org" @save="updateOrg"> </basic-panel>
      <senior-panel
        v-if="content === TABS.SENIOR.name && $can('platform.organization.delete')"
        @delete="deleteOrg()"
        :users="users"
        :org="org"
      >
      </senior-panel>
    </div>
  </div>
</template>

<script>
import OrgService from '@/core/services/org.service';
// panels
import BasicPanel from './overview-basic';
import SeniorPanel from './overview-senior';

export default {
  name: 'OverView',
  props: {
    org: { type: Object, default: () => ({}) },
    orgId: { type: String, default: '' },
    users: { type: Array, default: () => [] },
  },
  components: {
    BasicPanel,
    SeniorPanel,
  },
  data() {
    const TABS = {
      BASIC: {
        name: '基础设置',
        canShow: true,
      },
      SENIOR: {
        name: '高级设置',
        canShow: this.$can('platform.organization.delete'),
      },
    };
    return {
      TABS,
      content: TABS.BASIC.name,
    };
  },
  methods: {
    updateOrg(org) {
      OrgService.updateOrg(this.orgId, org).then(newOrg => {
        this.$emit('save', newOrg);
        this.$noty.success('租户信息修改成功');
      });
    },

    deleteOrg() {
      OrgService.deleteOrg(this.orgId).then(() => {
        this.$noty.success('删除租户成功');
        this.$router.push({
          name: 'manage.org.list',
        });
      });
    },
  },
};
</script>
