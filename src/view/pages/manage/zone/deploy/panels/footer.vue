<template>
  <div class="panel-footer">
    <div class="container checkout-select">
      <div class="step-btns" v-if="step === steps.CONFIG">
        <button
          title="下一步:参数设置"
          class="dao-btn blue"
          @click="$emit('next', step)">
          下一步:确认{{ operationLabel }}
        </button>
      </div>
      <!-- 第二步 -->
      <div class="step-btns" v-if="step === steps.OVERVIEW">
        <button
          title="上一步:参数设置"
          class="dao-btn ghost"
          @click="$emit('prev', step)">
          上一步:参数设置
        </button>
        <save-button
          :text="'确认' + operationLabel"
          :saving="isEditing"
          @click="$emit('deploy')">
        </save-button>
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
    isEditing: { type: Boolean, default: false },
    operationLabel: { type: String },
  },
};
</script>

<style lang='scss'>
@import '~daoColor';

.panel-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  width: 100%;
  height: 70px;
  color: #99a1ad;
  background: #fff;

  .step-btns {
    text-align: right;
  }
}
</style>
