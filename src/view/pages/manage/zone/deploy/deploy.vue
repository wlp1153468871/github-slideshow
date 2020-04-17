<template>
  <div class="checkout-module">
    <div class="top-bar">
      <div class="header-title">
        <a class="go-back" href="javascript:void(0)" @click="$router.go(-1)">
          <svg class="icon">
            <use xlink:href="#icon_caret-left"></use>
          </svg>
          <span class="text">返回</span>
        </a>
        <span class="service-name">{{ operationLabel }} 可用区</span>
      </div>
    </div>

    <div class="page-content container">
      <div class="dao-view-content">
        <config-panel
          ref="configPanel"
          v-show="step === STEPS.CONFIG"
          :operation-label="operationLabel"
          v-model="zoneModel"
        >
        </config-panel>

        <overview-panel
          v-if="step === STEPS.OVERVIEW"
          :operation-label="operationLabel"
          :zone="zoneModel"
        >
        </overview-panel>

        <finish-panel
          v-if="step === STEPS.FINISH"
          :operation-label="operationLabel"
          :instance="zoneInstance"
          :error="instanceError"
          @prev="prev(STEPS.FINISH)"
        >
        </finish-panel>
      </div>
    </div>

    <footer-panel
      :operation-label="operationLabel"
      :steps="STEPS"
      :step="step"
      :is-editing="isEditing"
      @prev="prev"
      @next="next"
      @deploy="deploy"
    >
    </footer-panel>
  </div>
</template>

<script src="./_deploy.js"></script>
