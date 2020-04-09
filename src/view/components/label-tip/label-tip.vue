<template>
  <dao-tooltip :content="text" :placement="placement">
    <svg class="icon">
      <use xlink:href="#icon_info-line"></use>
    </svg>
  </dao-tooltip>
</template>

<script>
export default {
  name: 'LabelTip',
  props: {
    text: { type: String, default: '' },
    placement: { type: String, default: 'top' },
  },
};
</script>
