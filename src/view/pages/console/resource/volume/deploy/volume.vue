<template>
  <div class="checkout-module">
    <div class="top-bar">
      <div class="header-title">
        <a
          class="go-back"
          href="javascript:void(0)"
          @click="$router.go(-1)">
          <svg class="icon">
            <use xlink:href="#icon_caret-left"></use>
          </svg>
          <span class="text">返回</span>
        </a>
        <span class="service-name">PVC</span>
      </div>
    </div>

    <config-panel
      v-show="STEPS.CONFIG === stepIndex"
      ref="configPanel"
      @valid="valid = $event">
    </config-panel>

    <overview-panel
      v-if="STEPS.OVERVIEW === stepIndex"
      :form-model="formModel">
    </overview-panel>

    <finish-panel
      v-if="STEPS.FINISH === stepIndex"
      :error="error"
      :volume="formModel"
      :STEPS="STEPS"
      @prev="prev">
    </finish-panel>

    <checkout-footer-panel
      v-if="!purchased"
      :steps="STEPS"
      :step-index="stepIndex"
      @prev="prev"
      @next="next"
      @purchase="purchase"
      :purchasing="purchasing">
    </checkout-footer-panel>
  </div>
</template>

<script src="./_volume.js">
</script>
