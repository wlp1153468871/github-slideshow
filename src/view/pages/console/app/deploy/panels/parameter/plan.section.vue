<template>
  <dao-setting-layout>
    <template #layout-title>规格</template>
    <dao-setting-section>
      <template #label>
        <span>CPU 限制</span>
      </template>
      <template #content>
        <dao-input
          ref="limitCpu"
          icon-inside
          placeholder="0~128"
          name="limitCpu"
          v-validate="'required|decimal:3|min_value:0|max_value:8'"
          :message="veeErrors.first('limitCpu')"
          :status="veeErrors.has('limitCpu') ? 'error' : ''"
          v-model="limitCpu"
          data-vv-as="CPU 限制"
        >
          <span slot="append">Core</span>
        </dao-input>
      </template>
      <template #content-helper>
        <p>限制单个容器内 CPU 的核数, 不能低于 CPU 预留值, 可以是小数</p>
      </template>
    </dao-setting-section>

    <dao-setting-section>
      <template #label>
        <span>内存限制</span>
      </template>
      <template #content>
        <dao-input
          ref="limitMem"
          icon-inside
          placeholder="0~128"
          name="limitMem"
          v-validate="'required|decimal:3|min_value:0|max_value:128'"
          :message="veeErrors.first('limitMem')"
          :status="veeErrors.has('limitMem') ? 'error' : ''"
          v-model="limitMem"
          data-vv-as="内存限制"
        >
          <span slot="append">G</span>
        </dao-input>
      </template>
      <template #content-helper>
        <p>限制单个容器内内存使用量, 不能低于内存预留值, 可以是小数</p>
      </template>
    </dao-setting-section>

    <dao-setting-section>
      <template #label>
        <span>CPU 预留</span>
      </template>
      <template #content>
        <dao-input
          icon-inside
          placeholder="0~128"
          name="cpu"
          v-validate="{
            required: true,
            decimal: 3,
            min_value: 0,
            max_value: limitCpu,
          }"
          :message="veeErrors.first('cpu')"
          :status="veeErrors.has('cpu') ? 'error' : ''"
          v-model="cpu"
          data-vv-as="CPU 预留"
        >
          <span slot="append">Core</span>
        </dao-input>
      </template>
      <template #content-helper>
        <p>预留 CPU 的核数, 不能高于 CPU 限制, 可以是小数</p>
      </template>
    </dao-setting-section>

    <dao-setting-section>
      <template #label>
        <span>内存预留</span>
      </template>
      <template #content>
        <dao-input
          icon-inside
          placeholder="0~128"
          name="mem"
          v-model="mem"
          v-validate="{
            required: true,
            decimal: 3,
            min_value: 0,
            max_value: limitMem,
          }"
          :message="veeErrors.first('mem')"
          :status="veeErrors.has('mem') ? 'error' : ''"
          data-vv-as="内存预留"
        >
          <span slot="append">G</span>
        </dao-input>
      </template>
      <template #content-helper>
        <p>内存预留 不能高于 内存限制, 可以是小数</p>
      </template>
    </dao-setting-section>
  </dao-setting-layout>
</template>

<script>
import { set as setVal, cloneDeep } from 'lodash';

export default {
  name: 'PlanSection',

  inject: ['$validator'],

  props: {
    plan: {
      type: Object,
      default() {
        return {
          limits: {
            cpu: { value: '1', unit: 'core' },
            memory: { value: '4', unit: 'g' },
          },
          requests: {
            cpu: { value: '1', unit: 'core' },
            memory: { value: '4', unit: 'g' },
          },
        };
      },
    },
  },

  computed: {
    cpu: {
      get() {
        return this.plan.requests.cpu.value;
      },
      set(cpu) {
        this.updatePlan('requests.cpu.value', cpu);
      },
    },
    limitCpu: {
      get() {
        return this.plan.limits.cpu.value;
      },
      set(cpu) {
        this.updatePlan('limits.cpu.value', cpu);
      },
    },
    mem: {
      get() {
        return this.plan.requests.memory.value;
      },
      set(mem) {
        this.updatePlan('requests.memory.value', mem);
      },
    },
    limitMem: {
      get() {
        return this.plan.limits.memory.value;
      },
      set(mem) {
        this.updatePlan('limits.memory.value', mem);
      },
    },
  },

  methods: {
    updatePlan(path, value) {
      const plan = cloneDeep(this.plan);
      this.$emit('update:plan', setVal(plan, path, value));
    },
  },
};
</script>
