<template>
  <div>
    <empty-state
      title="加载中"
      v-if="loading">
    </empty-state>
    <empty-state
      title="容器组为空，无实时日志信息"
      v-else-if="!pods.length">
    </empty-state>
    <pod-log
      :pod="pod"
      :pod-name="podName"
      v-else-if="pods.length">
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
      </el-select>
    </pod-log>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import DeploymentResourceService from '@/core/services/deployment.resource.service';
import DCService from '@/core/services/deployment-config.service.ts';
import StatefulSetService from '@/core/services/stateful-set.service.ts';


import PodLog from './pod-log';

export default {
  name: 'LogPanel',

  components: {
    PodLog,
  },

  props: {
    // deploymentConfig or deployment
    type: { type: String, default: 'deployment' },
  },

  data() {
    const { name } = this.$route.params;
    return {
      name,
      podName: '',
      pods: [],
      loading: true,
    };
  },

  created() {
    this.getPods();
  },

  computed: {
    ...mapState(['space', 'zone']),
    pod() {
      return this.pods.find(pod => pod.metadata.name === this.podName) || {};
    },
  },

  methods: {
    getPodService() {
      switch (this.type) {
        case 'deployment':
          return DeploymentResourceService.getPods(
            this.space.id,
            this.zone.id,
            this.name,
          );
        case 'deploymentConfig':
          return DCService.getPodList(
            this.space.id,
            this.zone.id,
            this.name,
          );
        case 'statefulSet':
          return StatefulSetService.getPodList(
            this.space.id,
            this.zone.id,
            this.name,
          );
        default:
          return DeploymentResourceService.getPods(
            this.space.id,
            this.zone.id,
            this.name,
          );
      }
    },
    getPods() {
      this.loading = true;
      return this.getPodService()
        .then(res => {
          if (res.originData.items && res.originData.items.length > 0) {
            this.pods = res.originData.items;
            this.podName = res.originData.items[0].metadata.name;
          }
        })
        .catch(() => {
          // console.error(e);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
