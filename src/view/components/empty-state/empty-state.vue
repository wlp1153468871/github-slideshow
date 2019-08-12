<template>
  <div class="empty-state">
    <div class="empty-state-title">
      {{ title }}
      <slot name="title"></slot>
    </div>
    <div class="empty-state-text">
      {{ text }}
      <slot name="text"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    title: { type: String, default: '暂无数据' },
    text: { type: String, default: '' },
  },
};
</script>

<style lang="scss">
.empty-state {
  color: #9ba3af;
  text-align: center;
  background-color: #fbfcfc;

  &-title {
    font-size: 14px;
    font-weight: normal;
    line-height: 60px;
  }

  &-test {
    font-size: 14px;
    font-weight: 400;
    line-height: 24px;
  }
}
</style>
