<template>
  <div
    :class="[
      'dao-option-item',
      { 'disabled': disabled, 'active': active } ]"
    @click="handleClick($event)">
    <svg class="icon checkmark">
      <use xlink:href="#icon_checkmark"></use>
    </svg>
    <span>
      <slot>{{ label }}</slot>
    </span>
  </div>
</template>

<script>
export default {
  name: 'Option',
  props: {
    disabled: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    value: { type: String, default: '' },
    label: { type: String, default: '' },
  },
  data() {
    return {
    };
  },
  methods: {
    handleClick(event) {
      this.$emit('click', event);
    },
  },
};
</script>

<style lang="scss">
// using dao-style dao-option class
</style>
