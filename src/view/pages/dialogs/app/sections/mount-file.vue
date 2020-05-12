<template>
  <section-mount-file :configMaps="configMaps" :secrets="secrets" v-model="editFiles">
  </section-mount-file>
</template>

<script>
import { cloneDeep } from 'lodash';
import SectionMountFile from '@/view/pages/console/app/deploy/sections/mount-file';

export default {
  name: 'MountFile',
  components: {
    SectionMountFile,
  },

  props: {
    configFiles: { type: Array, default: () => [] },
    configMaps: {
      type: Array,
      default: () => [],
    },
    secrets: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      editEnvs: [],
      isValid: true,
    };
  },

  watch: {
    configFiles: {
      immediate: true,
      handler(val) {
        this.editFiles = cloneDeep(val);
      },
    },
  },

  methods: {
    validChange(valid) {
      this.isValid = valid;
    },

    validate() {
      return this.isValid;
    },

    providePartialModel() {
      const { editFiles } = this;
      return {
        configFiles: editFiles,
      };
    },
  },
};
</script>
