<template>
  <env-editor
    :initEnvs="dcEnv"
    :secrets="secrets"
    :configMaps="configMaps"
    @envUpdate="newEnv => $emit('envUpdate', newEnv)"
  ></env-editor>
</template>

<script>
export default {
  name: 'EnvPanel',
  props: ['dcEnv', 'secrets', 'configMaps'],
};
</script>
