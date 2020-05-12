<template>
  <env-editor
    :initEnvs="ssEnv"
    :secrets="secrets"
    :editable="$can('statefulSet.update')"
    @envUpdate="onEnvUpdate"
    :configMaps="configMaps"
  ></env-editor>
</template>

<script>
export default {
  name: 'EnvPanel',
  props: ['ssEnv', 'secrets', 'configMaps'],
  methods: {
    onEnvUpdate(value) {
      this.$emit('envUpdate', value);
    },
  },
};
</script>
