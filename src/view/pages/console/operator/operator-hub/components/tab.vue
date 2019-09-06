<template>
  <div class="d-tab">
    <div
      @click="onActivate"
      role="tab"
      aria-disabled="false"
      aria-selected="false"
    >
      {{ tab.label }}
    </div>
    <d-vertical-tabs
      v-if="tab.subcategories"
      :tabs="tab.subcategories"
    ></d-vertical-tabs>
  </div>
</template>

<script>
export default {
  name: 'DTab',

  props: {
    tab: { type: Object },
  },

  methods: {
    onActivate() {
      this.$emit('activate', this.tab);
    },
  },
};
</script>

<style lang="scss">
.d-tab {
  position: relative;
  float: none;
  display: block;
  height: 100%;
  padding: 8px 20px;
  text-decoration: none;
  transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  cursor: pointer;

  &:hover {
    color: $blue;
  }

  &.active {
    color: $blue;
    &::before {
      background: currentColor;
      content: '\A0';
      left: 0;
      position: absolute;
      width: 3px;
    }
  }
}
</style>
