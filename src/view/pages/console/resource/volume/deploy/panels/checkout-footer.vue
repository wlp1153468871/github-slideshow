<template>
  <div class="checkout-module-footer">
    <div class="container checkout-select">
      <!-- 第一步 -->
      <div class="step-btns" v-if="stepIndex === steps.CONFIG">
        <button
          title="下一步:参数设置"
          class="dao-btn blue"
          @click="next()">
          下一步:确认订购
        </button>
      </div>
      <!-- 第二步 -->
      <div class="step-btns" v-if="stepIndex === steps.OVERVIEW">
        <button
          title="上一步:参数设置"
          class="dao-btn ghost"
          @click="prev()">
          上一步:参数设置
        </button>
        <save-button
          text="确认购买"
          class="dao-btn blue"
          :saving="purchasing"
          @click="$emit('purchase')">
          确认购买
        </save-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FooterPanel',

  props: {
    steps: { type: Object, default: () => ({}) },
    stepIndex: { type: String, default: '' },
    purchasing: { type: Boolean, default: false },
  },

  methods: {
    prev() {
      this.$emit('prev', this.stepIndex);
    },

    next() {
      this.$emit('next', this.stepIndex);
    },
  },
};
</script>
