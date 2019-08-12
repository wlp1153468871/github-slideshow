<template>
  <span>
    <span>
      <span v-if="!showForm">
         <span>
          {{data.status.replicas}}/
          {{data.spec.replicas}}
        </span>
        <span>replica</span>
        <span v-if="data.spec.replicas !== 1">s</span>
        <a
          @click="toggleForm()"
          v-if="$can('update') && !autoscalers.length"
          style="margin-left: 5px;">扩展</a>
      </span>
      <span v-else class="form">
        <input
          type="number"
          v-model.number="replicas"
          min="0"
          @input="onInputChange"
          placeholder="副本数"/>
        <a @click="extend()">确定</a>
        <a @click="showForm = false">取消</a>
      </span>
    </span>
  </span>
</template>

<script>
import { get } from 'lodash';

export default {
  name: 'inline-extend',
  props: {
    data: Object,
    autoscalers: { type: Array, default: () => [] },
  },
  data() {
    return {
      showForm: false,
      replicas: get(this.data, 'spec.replicas'),
    };
  },
  methods: {
    toggleForm() {
      this.showForm = true;
    },
    onInputChange() {
      if (this.replicas < 0) {
        this.replicas = 0;
      }
    },
    extend() {
      this.$emit('extend', this.replicas);
      this.showForm = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.form {
  * {
    margin-right: 5px;
  }

  input {
    width: 80px;
  }
}
</style>
