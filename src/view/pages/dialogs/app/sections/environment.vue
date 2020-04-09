<template>
  <section-env :configMaps="configMaps" :secrets="secrets" v-model="editEnvs"> </section-env>
</template>

<script>
import { cloneDeep } from 'lodash';
import SectionEnv from '@/view/pages/console/app/deploy/sections/env';

export default {
  name: 'LoadBalance',
  components: {
    SectionEnv,
  },

  props: {
    envs: { type: Array, default: () => [] },
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
      // config: {
      //   header: ['键', '值'],
      //   body: [
      //     {
      //       type: 'input',
      //       name: 'name',
      //       default: '',
      //       validate(row) {
      //         if (!/^[A-Za-z_]\w*$/.test(row.name)) {
      //           return '键只能是字母, 数字和下划线, 且不能以数字开头';
      //         }
      //         return true;
      //       },
      //     },
      //     {
      //       type: 'input',
      //       name: 'value',
      //       default: '',
      //     },
      //   ],
      // },
    };
  },

  watch: {
    envs: {
      immediate: true,
      handler() {
        this.editEnvs = cloneDeep(this.envs);
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
      const { editEnvs } = this;
      return {
        envs: editEnvs,
      };
    },
  },
};
</script>
