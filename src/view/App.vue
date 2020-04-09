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
    window.addEventListener('hashchange', this.onHashChange, false);
  },
  methods: {
    onHashChange() {
      const currentPath = window.location.hash.slice(1);
      if (this.$route.path !== currentPath) {
        this.$router.push(currentPath);
      }
    },
  },
  beforeDestory() {
    window.removeEventListener('hashchange', this.onHashChange, false);
  },
};
</script>
