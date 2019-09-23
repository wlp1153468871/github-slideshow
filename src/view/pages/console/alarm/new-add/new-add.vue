<template>
  <div id="alarm-new-add">
    <div class="header-title">
      <span
        class="go-back"
        @click="$router.go(-1)">
        <svg class="icon">
          <use xlink:href="#icon_caret-left"></use>
        </svg>
        <span class="text">返回</span>
      </span>
      <span class="service-name">{{ bannerTip }}</span>
    </div>
    <form-wizard
      title=""
      subtitle=""
      class="daox-wizard"
      @on-complete="onComplete"
      @on-validate="onValidate"
    >
      <template #step="{ tab, index }">
      <li
        class="step-content"
        :key="tab.title"
        :class="{ 'checked': tab.checked }">
        <a class="step-tab">
          <span class="step-icon">{{ index + 1 }}</span>
          <span class="step-title">{{ tab.title }}</span>
        </a>
      </li>
    </template>

      <tab-content
        title="选择指标"
        :before-change="validate">
        <step-one
          ref="okRules"
          :params="params"
        >
        </step-one>
      </tab-content>

      <tab-content title="确认规则">
        <step-two
          :chooseRules="rulesReady.chooseRules"
          :receiverInfo="rulesReady.receiverInfo"
          :instances="rulesReady.instances"
        >
        </step-two>
      </tab-content>

      <template #footer="props">
        <div class="container fixed-container">
          <div class="wizard-footer-right">
            <button
              class="dao-btn white"
              v-show="props.activeTabIndex !== 0"
              @click="props.prevTab()">
              上一步
            </button>
            <button
              class="dao-btn blue"
              v-show="!props.isLastStep"
              @click="props.nextTab()">
              下一步: 确认规则
            </button>
            <button
              class="dao-btn blue"
              v-show="props.isLastStep"
              @click="props.nextTab()">
              添加规则
            </button>
          </div>
        </div>
      </template>
    </form-wizard>
  </div>
</template>
<script src="./new-add.js"></script>
<style lang="scss">
  @import './new-add';
</style>
