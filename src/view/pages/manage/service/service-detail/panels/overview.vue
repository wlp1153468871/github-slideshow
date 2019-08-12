<template>
  <div class="dao-view-main">
    <div class="dao-view-sidebar">
      <div class="dao-list-group-container">
        <ul class="dao-list-group">
          <li
            class="dao-list-item"
            v-for="tab in TABS"
            :key="tab"
            :class="{ 'active' : content === tab }"
            @click="content = tab">
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
      <basic-panel
        v-if="content === TABS.BASIC"
        :service="value"
        @update="update">
      </basic-panel>
    </div>
  </div>
</template>

<script>
// panels
import BasicPanel from './overview-basic';
import SeniorPanel from './overview-senior';

export default {
  name: 'OverviewPanel',
  props: {
    value: { type: Object, default: () => ({}) },
  },
  components: {
    BasicPanel,
    SeniorPanel,
  },
  data() {
    const TABS = {
      BASIC: '基础设置',
      // SENIOR: '高级设置',
    };
    return {
      TABS,
      content: TABS.BASIC,
    };
  },
  methods: {
    update(service) {
      this.$emit('input', service);
    },
  },
};
</script>
