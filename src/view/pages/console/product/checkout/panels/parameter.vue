<template>
  <dao-setting-layout>
    <template slot="layout-title">参数设置</template>
    <div v-if="isLoading" class="dao-setting-section">
      <loading-state></loading-state>
    </div>
    <schema-form v-else ref="scehmaForm" v-model="model" :schema="JSONSchema"> </schema-form>
  </dao-setting-layout>
</template>

<script>
import { cloneDeep, get as getValue } from 'lodash';

export default {
  name: 'ParameterPanel',
  props: {
    schema: { type: Object, default: () => ({}) },
    isLoading: { type: Boolean, default: false },
  },
  data() {
    return {
      model: {},
      JSONSchema: {},
    };
  },

  watch: {
    schema: {
      immediate: true,
      handler(schema) {
        const create = getValue(schema, 'properties.create');
        this.JSONSchema = Object.assign({}, create || schema);
      },
    },
  },

  methods: {
    next() {
      const isValid = this.$refs.scehmaForm.validate();
      if (!isValid) {
        window.scrollTo(0, this.$refs.scehmaForm.$el.offsetTop - 100);
        this.$noty.error('填入参数错误，请修改正确后重新提交');
        return null;
      }
      return cloneDeep(this.model);
    },
  },
};
</script>

<style lang="scss" scoped>
.show-more {
  border-top: 1px solid #e4e7ed;
}
</style>
