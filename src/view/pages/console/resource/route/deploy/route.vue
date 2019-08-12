<template>
  <div class="page-deploy-router">
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
        <span class="service-name">Route</span>
      </div>
    </div>

    <div class="page-content container">
      <div class="dao-view-content">
        <config-panel
          v-show="step === STEPS.CONFIG"
          v-model="route"
          ref="configPanel">
        </config-panel>

        <overview-panel
          v-if="step === STEPS.OVERVIEW"
          :route="route">
        </overview-panel>

        <finish-panel
          v-if="step === STEPS.FINISH"
          :route="instance"
          :error="instanceError"
          :is-creating="isCreating"
          @prev="prev(STEPS.FINISH)">
        </finish-panel>
      </div>
    </div>

    <footer-panel
      :steps="STEPS"
      :step="step"
      :is-creating="isCreating"
      @prev="prev"
      @next="next"
      @deploy="deploy">
    </footer-panel>


  </div>
</template>

<script src="./_deploy.js">
</script>

<style lang="scss">
@import "deploy";
</style>
