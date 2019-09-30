<template>
  <div class="checkout-module">
    <div class="top-bar">
      <div class="header-title">
        <span
          class="go-back"
          @click="$router.go(-1)">
          <svg class="icon">
            <use xlink:href="#icon_caret-left"></use>
          </svg>
          <span class="text">返回</span>
        </span>
        <span class="service-name">服务 {{ service.name }}</span>
      </div>
    </div>

    <div class="container">
      <div class="dao-view-content">

        <config-panel
          v-show="STEPS.CONFIG === stepIndex"
          ref="configPanel"
          :broker-service-id="brokerServiceId"
          :service="service"
          @valid="valid = $event"
          @searchChargingRules="searchChargingRules"
        ></config-panel>

        <!--确认订购-->
        <overview-panel
          v-show="STEPS.OVERVIEW === stepIndex"
          :form-model="formModel"
          :service-name="service.name"
          :purchasing="loadings.purchasing"
          @prev="prev(STEPS.OVERVIEW)"
          @next="purchase">
        </overview-panel>

        <!-- 成功 -->
        <finish-panel
          v-if="STEPS.FINISH === stepIndex"
          :instance="instance"
          :error="instanceError"
          :service-id="service.id"
          @prev="prev(STEPS.FINISH)">
        </finish-panel>
      </div>
    </div>

    <checkout-footer-panel
      :steps="STEPS"
      :step-index="stepIndex"
      :charging-types="chargingTypes"
      :price="price"
      :valid="valid"
      :purchase-status="loadings.purchasing"
      @prev="prev"
      @next="next"
      @purchase="purchase"
      @changeChargingType="changeChargingType">
    </checkout-footer-panel>
  </div>
</template>

<script src="./checkout.js">
</script>

<style lang="scss">
@import './checkout';
</style>
