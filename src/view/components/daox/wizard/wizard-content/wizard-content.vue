<template>
  <div
    v-show="active"
    class="wizard-tab-container"
    role="tabpanel"
    :id="tabId"
    :aria-hidden="!active"
    :aria-labelledby="`step-${tabId}`">
    <slot :active="active">
    </slot>
  </div>
</template>

<script src="./wizard-content.js"></script>
