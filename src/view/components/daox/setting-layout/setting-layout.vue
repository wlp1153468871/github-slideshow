<template>
  <div class="daox-setting-layout">
    <div class="daox-setting-layout-header" v-if="layoutTitleSlot">
      <div class="daox-setting-title">
        <slot name="layout-title"></slot>
      </div>
      <slot name="layout-setting"></slot>
    </div>
    <div class="dao-setting-layout">
      <slot></slot>
      <div class="dao-setting-layout-footer" v-if="footerSlot">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DaoSettingLayout',
  computed: {
    footerSlot() {
      return this.$slots.footer;
    },
    layoutTitleSlot() {
      return this.$slots['layout-title'];
    },
  },
};
</script>

<style lang="scss">
.daox-setting-layout {
  margin-top: 20px;

  &:first-child {
    margin-top: 0;
  }

  .daox-setting-layout-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 5px;
    font-size: 14px;
    line-height: 24px;
  }

  & > .dao-setting-layout {
    padding-left: 20px;
    margin-top: 0;
    & > .dao-setting-section {
      padding: 25px 20px 25px 0;
      word-wrap: break-word;
    }
  }

  .dao-setting-layout:not(:first-of-type) {
    margin-top: 0;
  }

  .dao-setting-layout-footer {
    margin-left: -20px;
  }
}
</style>
