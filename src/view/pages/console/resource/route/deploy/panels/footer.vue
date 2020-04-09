<!--Created by Max on 2018-12-26.-->
<template>
  <div class="checkout-module-footer">
    <div class="container checkout-select">
      <div class="step-btns" v-if="step === steps.CONFIG">
        <button title="下一步:参数设置" class="dao-btn blue" @click="$emit('next', step)">
          下一步:确认订购
        </button>
      </div>
      <!-- 第二步 -->
      <div class="step-btns" v-if="step === steps.OVERVIEW">
        <button title="上一步:参数设置" class="dao-btn ghost" @click="$emit('prev', step)">
          上一步:参数设置
        </button>
        <save-button text="确认购买" :saving="isCreating" @click="$emit('deploy')"> </save-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'panel-footer',

  props: {
    step: { type: String },
    steps: { type: Object, default: () => ({}) },
    isCreating: { type: Boolean, default: false },
  },
};
</script>

<style lang="scss">
@import '~daoColor';
</style>
