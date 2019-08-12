<template>
  <div class="app-inner-footer">
    <span v-if="theme.productName" class="app-name">
      {{ theme.productName }}
    </span>
    <span v-else class="app-name">
      <b>如意云</b>平台
    </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'InnerFooter',
  computed: {
    ...mapGetters(['theme']),
  },
};
</script>

<style lang="scss">
.app-inner-footer {
  padding: 15px 0;
  color: #9ba3af;
  font-size: 13px;
  line-height: 18px;
  text-align: center;

  b {
    font-weight: 600;
  }

  .app-name {
    position: relative;
    &:before,
    &:after {
      content: ' ';
      position: absolute;
      top: 50%;
      width: 20px;
      height: 1px;
      border-bottom: 1px solid #cad0d8;
    }
    &:before {
      left: -28px;
    }
    &:after {
      right: -28px;
    }
  }
}
</style>
