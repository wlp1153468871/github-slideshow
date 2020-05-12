<template>
  <router-link class="svg-container" :to="to">
    <div class="logo">
      <svg style="width: 100%;">
        <use xlink:href="#icon_app-icon"></use>
      </svg>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'SideBarLogo',
  props: {
    to: { type: Object, default: () => ({}) },
  },
};
</script>
