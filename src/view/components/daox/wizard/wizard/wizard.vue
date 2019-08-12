<template>
  <div
    class="daox-wizard"
    @keyup.right="focusNextTab"
    @keyup.left="focusPrevTab">
    <div class="wizard-navigation">
      <div class="wizard-nav">
        <div class="wizard-nav-left">
          <slot name="wizard-nav-left"></slot>
        </div>
        <ul class="wizard-nav-pills" role="tablist">
          <slot
            name="step"
            v-for="(tab, index) in tabs"
            :tab="tab"
            :index="index"
            :navigate-to-tab="navigateToTab">
            <li
              class="step-content"
              :key="tab.title"
              :class="{ 'checked': tab.checked }">
              <a class="step-tab">
                <span class="step-icon">{{ index + 1 }}</span>
                <span class="step-title">{{ tab.title }}</span>
              </a>
            </li>
          </slot>
        </ul>
        <div class="wizard-nav-right">
          <slot name="wizard-nav-right"></slot>
        </div>
      </div>
      <div class="wizard-tab-content">
        <slot v-bind="slotProps">
        </slot>
      </div>
    </div>

    <div class="wizard-card-footer clearfix" v-if="!hideButtons">
      <slot name="footer" v-bind="slotProps">
        <div class="wizard-footer-left">
          <span
            @click="prevTab"
            @keyup.enter="prevTab"
            v-if="displayPrevButton"
            role="button"
            tabindex="0">
            <slot name="prev" v-bind="slotProps">
              <wizard-button
                :style="fillButtonStyle"
                :disabled="loading">
                {{ backButtonText }}
              </wizard-button>
            </slot>
          </span>
          <slot name="custom-buttons-left" v-bind="slotProps"></slot>
        </div>

        <div class="wizard-footer-right">
          <slot name="custom-buttons-right" v-bind="slotProps"></slot>
          <span
            @click="nextTab"
            @keyup.enter="nextTab"
            v-if="isLastStep"
            role="button"
            tabindex="0">
            <slot name="finish" v-bind="slotProps">
              <button :style="fillButtonStyle">
                {{ finishButtonText }}
              </button>
            </slot>
          </span>
          <span
            @click="nextTab"
            @keyup.enter="nextTab"
            role="button"
            tabindex="0"
            v-else>
            <slot name="next" v-bind="slotProps">
              <button
                :style="fillButtonStyle"
                :disabled="loading">
                {{ nextButtonText }}
              </button>
            </slot>
          </span>
        </div>
      </slot>
    </div>
  </div>
</template>

<script src="./wizard.js"></script>

<style lang="scss">
@import './wizard.scss';
</style>
