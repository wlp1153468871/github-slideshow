<template>
  <div>
    <empty-state title="容器组为空，无实时日志信息" v-if="!pods.length"> </empty-state>
    <pod-log :pod="pod" :pod-name="podName" v-if="pods.length">
      <label>Pod: </label>
      <el-select size="small" filterable v-model="podName" placeholder="Pod Name">
        <el-option
          v-for="pod in pods"
          :key="pod.metadata.name"
          :label="pod.metadata.name"
          :value="pod.metadata.name"
        >
        </el-option>
      </el-select>
    </pod-log>
  </div>
</template>

<script>
import PodLog from '@/view/components/log/pod-log';

export default {
  name: 'LogPanel',

  components: {
    PodLog,
  },

  props: {
    pods: { type: Array, default: () => [] },
  },

  data() {
    const { pods } = this;
    let podName = '';
    if (pods.length) {
      podName = pods[0].metadata.name;
    }
    return {
      podName,
    };
  },

  computed: {
    pod() {
      return this.pods.find(pod => pod.metadata.name === this.podName) || {};
    },
  },
};
</script>
