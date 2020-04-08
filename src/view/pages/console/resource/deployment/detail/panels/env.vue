<template>
  <env-editor
    :initEnvs="deployment.spec.template.spec.containers"
    :secrets="secrets"
    :configMaps="configMaps"
    :editable="$can('deployment.update', 'deployment')"
    @envUpdate="(newEnv) => $emit('envUpdate', newEnv)">
  </env-editor>
</template>

<script>
export default {
  name: 'EnvPanel',

  props: {
    deployment: { type: Object, default: () => ({}) },
    secrets: { type: Object, default: () => ({}) },
    configMaps: { type: Object, default: () => ({}) },
  },
};
</script>
