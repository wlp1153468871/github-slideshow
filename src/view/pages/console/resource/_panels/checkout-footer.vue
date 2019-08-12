<template>
  <div class="dao-setting-layout-footer">
    <div class="container checkout-select">
      <div class="price" v-if="chargingEnable">
        <dao-setting-item>
          <div slot="label">计费模式:</div>
          <div slot="content">
            <dao-select
              v-model="type"
              @change="changeChargingType">
              <dao-option
                v-for="option in chargingTypes"
                :key="option.charging_type.code"
                :value="option.charging_type.code"
                :label="option.charging_type.description">
              </dao-option>
            </dao-select>
          </div>
        </dao-setting-item>
        <dao-setting-item>
          <div slot="label">合计费用:</div>
          <div slot="content">
            <span class="number">{{ price | fen_2_yuan }}<span class="price-unit">元</span></span>
          </div>
        </dao-setting-item>
      </div>
      <!-- 第一步 -->
      <div class="step-btns" v-if="stepIndex === steps.CONFIG">
        <button
          :disabled="!valid"
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
        <button
          title="确认购买"
          class="dao-btn blue"
          :disabled="purchaseStatus"
          @click="$emit('purchase')">
          确认购买
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ChargeModuleFooterMixin from '@/view/mixins/charge-module-footer';

export default {
  name: 'FooterPanel',

  mixins: [ChargeModuleFooterMixin],

  props: {
    steps: { type: Object, default: () => ({}) },
    stepIndex: { type: String, default: '' },
    valid: { type: Boolean, default: false },
    purchaseStatus: { type: Boolean, default: true },
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
