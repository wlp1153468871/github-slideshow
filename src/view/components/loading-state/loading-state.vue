<template>
  <div class="loading-state">
    <svg class="loading-icon rotating">
      <use xlink:href="#icon_circle-rotate"></use>
    </svg>
    <div class="loading-state-title">
      {{ title }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingState',
  props: {
    title: { type: String, default: '正在加载数据...' },
  },
};
</script>

<style lang="scss">
.loading-state {
  padding: 40px;
  color: #9ba3af;
  text-align: center;
  background-color: #fbfcfc;
  border: 1px dashed #e4e7ed;

  .loading-icon {
    width: 50px;
    height: 50px;
  }

  .loading-state-title {
    font-size: 16px;
    font-weight: 500;
    line-height: 40px;
  }

  .loading-state-message {
    font-size: 14px;
    font-weight: 400;
    line-height: 24px;
  }
}
</style>
