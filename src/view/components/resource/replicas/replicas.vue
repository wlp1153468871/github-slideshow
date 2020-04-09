<template>
  <span>{{ spec }} replica<span v-if="spec !== 1">s</span></span>
</template>

<script>
export default {
  name: 'Replicas',

  props: { spec: { type: Object, default: () => ({}) } },

  data() {
    return {};
  },
};
</script>
