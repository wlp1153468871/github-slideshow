<template>
  <div class="dao-view-main">
    <div class="dao-view-sidebar">
      <div class="dao-list-group-container">
        <ul class="dao-list-group">
          <li
            class="dao-list-item"
            v-for="tab in TABS"
            :key="tab"
            :class="{ active: content === tab }"
            @click="content = tab"
          >
            <div>
              {{ tab }}
              <span class="icon">
                <svg><use xlink:href="#icon_caret-right"></use></svg>
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="dao-view-content with-sidebar">
      <overview-basic-panel v-if="content === TABS.BASIC" :space="space" @save="updateSpace">
      </overview-basic-panel>
      <overview-senior-panel
        :users="users"
        v-if="content === TABS.SENIOR"
        :space="space"
        @delete="deleteSpace"
      >
      </overview-senior-panel>
    </div>
  </div>
</template>

<script>
import SpaceService from '@/core/services/space.service';
import OverviewBasicPanel from './overview-basic';
import OverviewSeniorPanel from './overview-senior';

export default {
  name: 'SpaceOverView',
  props: {
    orgId: { type: String, default: '' },
    space: { type: Object, default: () => ({}) },
    spaceId: { type: String, default: '' },
    users: { type: Array, default: () => [] },
  },
  components: {
    OverviewBasicPanel,
    OverviewSeniorPanel,
  },
  data() {
    const TABS = {
      BASIC: '基础设置',
      SENIOR: '高级设置',
    };
    return {
      TABS,
      content: TABS.BASIC,
    };
  },
  methods: {
    updateSpace(space) {
      SpaceService.updateSpace(this.spaceId, space).then(newSpace => {
        this.$emit('save', newSpace);
        this.$noty.success('项目组信息修改成功');
      });
    },

    deleteSpace() {
      return SpaceService.deleteSpace(this.spaceId).then(() => {
        this.$noty.success('删除项目组成功');
        this.$router.push({
          name: 'manage.org.detail',
          params: {
            org: this.orgId,
          },
          query: {
            tab: '项目组',
          },
        });
      });
    },
  },
};
</script>
