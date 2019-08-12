<template>
  <div class="dao-view-main" style="margin: 0;">
    <div class="dao-view-sidebar">
      <daox-list-group
        :content.sync="sidebar"
        :groups="SIDE_BARS">
      </daox-list-group>
    </div>
    <div class="dao-view-content with-sidebar">
      <adavance-panel
        v-if="sidebar === TABS.ADVANCE"
        :instance="instance">
      </adavance-panel>
    </div>
  </div>
</template>

<script>
import AdavancePanel from '../sections/advance';

export default {
  name: 'ParameterPanel',

  props: {
    instance: { type: Object, default: () => ({}) },
  },

  components: {
    AdavancePanel,
  },

  data() {
    const TABS = {
      ADVANCE: '高级设置',
    };
    const SIDE_BARS = [[TABS.ADVANCE]];
    return {
      TABS,
      SIDE_BARS,
      sidebar: TABS.ADVANCE,
    };
  },
};
</script>
