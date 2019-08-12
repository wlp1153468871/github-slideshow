<template>
  <a href="javascript:void(0)" @click="redirect">
    {{ text }}
  </a>
</template>

<script>
export default {
  name: 'LinkData',
  props: {
    row: { type: Object, default: () => ({}) },
    router: { type: Object, default: () => ({}) },
    text: { type: String, default: '' },
  },
  methods: {
    redirect() {
      if (this.router.name) {
        this.$router.push(this.router);
      } else {
        this.$emit('click', this.row);
      }
    },
  },
};
</script>
