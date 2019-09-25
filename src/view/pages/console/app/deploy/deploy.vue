<template>
  <div class="deploy-app">
    <div class="header-title">
      <span
        class="go-back"
        @click="$router.go(-1)">
        <svg class="icon">
          <use xlink:href="#icon_caret-left"></use>
        </svg>
        <span class="text">返回</span>
      </span>
      <span class="service-name">应用</span>
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
        title="基本配置"
        :before-change="validateParameters">
        <parameter-panel
          ref="parameter"
          :repository="form.repository">
        </parameter-panel>
      </tab-content>

      <tab-content title="确认信息">
        <overview-panel
          v-if="!isShowResult"
          :app="form">
        </overview-panel>
        <finish-panel
          v-if="isShowResult"
          :instance="instance"
          :error="instanceError"
          @prev="hideResult">
        </finish-panel>
      </tab-content>

      <template #footer="props">
        <div class="container fixed-container" v-show="!isShowResult">
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
              下一步: 确认信息
            </button>
            <button
              class="dao-btn blue"
              v-show="props.isLastStep"
              :disabled="loadings.purchasing"
              @click="props.nextTab()">
              创建实例
            </button>
          </div>
        </div>
      </template>
    </form-wizard>
  </div>
</template>

<script src="./deploy.js"></script>

<style lang="scss" src="./deploy.scss"></style>
