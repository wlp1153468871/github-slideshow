<template>
  <div class="d-tabs">
    <d-tab
      v-for="tab in tabs"
      :tab="tab"
      :key="tab.id"
      @activate="$emit('input', $event)"
      :class="{ active: value === tab }"
    >
    </d-tab>
  </div>
</template>

<script>
export default {
  name: 'DVerticalTabs',

  components: {
    DTab: () => import('./tab.vue'),
  },

  props: {
    tabs: { type: [Array, Object], required: true },
    value: { type: Object },
  },
};
</script>

<style lang="scss">
.d-tabs {
  box-sizing: border-box;
  padding-left: 0;
  transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  position: relative;
  margin: 0;
  list-style: none;
  display: inline-block;
  width: 100%;
  margin-bottom: 50px;
}
</style>
