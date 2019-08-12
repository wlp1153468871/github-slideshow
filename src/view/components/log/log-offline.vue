<template>
  <div>
    <empty-state
      title="加载中"
      v-if="loading">
    </empty-state>
    <empty-state
      title="容器组为空，无离线日志信息"
      v-else-if="!pods.length">
    </empty-state>
    <pod-offline-log :pod="pod" v-else-if="pods.length">
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
import { mapState } from 'vuex';

import { cloneDeep } from 'lodash';

import DeploymentResourceService from '@/core/services/deployment.resource.service';
import DCService from '@/core/services/deployment-config.service.ts';
import StatefulSetService from '@/core/services/stateful-set.service.ts';

import PodOfflineLog from './pod-offline-log';

export default {
  name: 'LogOfflinePanel',

  components: {
    PodOfflineLog,
  },

  props: {
    // deploymentConfig or deployment or statefulSet
    type: { type: String, default: 'deployment' },
  },

  data() {
    const { name } = this.$route.params;
    // const { pods } = this;
    // let podName = '';
    // if (pods.length) {
    //   podName = pods[0].metadata.name;
    // }
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
