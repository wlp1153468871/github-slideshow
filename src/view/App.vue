
<template>
  <router-view></router-view>
</template>

<script>
import AuthService from '@/core/services/auth.service'; // eslint-disable-line

export default {
  name: 'App',

  created() {
    this.$store.dispatch('loadTheme');
    this.$store.dispatch('loadSystemSettings');
  },
};
</script>
