<template>
  <div>
    <empty-state
      title="容器组为空，无离线日志信息"
      v-if="!pods.length">
    </empty-state>
    <pod-offline-log :pod="pod" v-if="pods.length">
      <label>Pod: </label>
      <el-select
        size="small"
        filterable
        v-model="podName"
        placeholder="Pod Name">
        <el-option
          v-for="pod in pods"
          :key="pod.metadata.name"
          :label="pod.metadata.name"
          :value="pod.metadata.name">
        </el-option>
        <el-option
          key="all"
          label="all"
          value="all">
        </el-option>
      </el-select>
    </pod-offline-log>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';
import PodOfflineLog from '@/view/components/log/pod-offline-log.vue';


export default {
  name: 'LogOfflinePanel',

  components: {
    PodOfflineLog,
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
      if (!this.pods.length) {
        return {};
      }
      if (this.podName === 'all') {
        const allPod = cloneDeep(this.pods[0]);
        allPod.metadata.name = '_all';
        return allPod;
      }
      return this.pods.find(pod => pod.metadata.name === this.podName);
    },
  },
};
</script>
