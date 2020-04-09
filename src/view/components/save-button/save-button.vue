<template>
  <button class="dao-btn blue" @click="onClick()" :disabled="disabled || saving">
    <svg v-show="saving" class="icon rotating">
      <use xlink:href="#icon_status-progress-circle"></use>
    </svg>
    <slot name="icon"></slot>
    {{ text }}
  </button>
</template>

<script>
export default {
  name: 'SaveButton',
  props: {
    disabled: { type: Boolean, default: false },
    saving: { type: Boolean, default: false },
    text: { type: String, default: '保存' },
  },
  methods: {
    onClick() {
      this.$emit('click');
    },
  },
};
</script>
