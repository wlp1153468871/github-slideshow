<template>
  <div>
    <config-map-section :config-maps="configMaps"> </config-map-section>

    <secret-section v-if="displaySecret" style="margin-top: 20px;" :secrets="secrets">
    </secret-section>
  </div>
</template>

<script>
import SecretSection from '../sections/secret';
import ConfigMapSection from '../sections/config-map';

export default {
  name: 'ConfigPanel',

  components: {
    SecretSection,
    ConfigMapSection,
  },

  props: {
    configMaps: { type: Array, default: () => [] },
    secrets: { type: Array, default: () => [] },
  },

  computed: {
    displaySecret() {
      return this.$can('read', 'Secret');
    },
  },
};
</script>
