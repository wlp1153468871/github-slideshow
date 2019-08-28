<template>
  <span class="logo-wrapper">
    <img
      v-if="isSelfDefined"
      :src="logoUrl"
      class="logo"
      alt="logo"/>
    <template v-else>
      <img
        v-if="inverse"
        class="logo"
        src="~@/assets/images/logo.png"
        alt="logo"/>
      <img
        v-else
        src="~@/assets/images/logo-white.png"
        class="logo"
        alt="logo"/>
    </template>
  </span>
</template>

<script>
import { mapState } from 'vuex';
import { get as getValue } from 'lodash';

export default {
  name: 'logo-container',

  props: {
    inverse: { type: Boolean, default: false },
    target: { type: String },
  },

  computed: {
    ...mapState(['theme']),

    isSelfDefined() {
      if (this.target === 'login') {
        return !!getValue(this.theme, 'appPicture.loginPicture');
      }
      return !!getValue(this.theme, 'appPicture.navPicture');
    },

    logoUrl() {
      if (this.target === 'login') {
        return `${getValue(this.theme, 'appPicture.loginPicture')}`;
      }
      return `${getValue(this.theme, 'appPicture.navPicture')}`;
    },
  },
};
</script>

<style lang="scss">
.logo-wrapper {
  display: inline-block;
  height: 100%;

  .logo {
    max-width: 100%;
    max-height: 100%;
    display: block;
    padding: 10px 0;
  }
}
</style>
