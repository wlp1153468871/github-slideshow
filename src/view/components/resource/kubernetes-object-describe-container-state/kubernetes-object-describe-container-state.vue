<template>
  <div class="kubernetes-object-describe-container-state">
    <p v-if="isEmpty(containerState)"><em>none</em></p>
    <span v-for="(stateDescription, state) in containerState" :key="state">
      <template v-if="state === 'waiting'">
        Waiting
        <span v-if="stateDescription.reason">({{ stateDescription.reason }})</span>
      </template>
      <template v-else-if="state === 'running'">
        Running
        <span v-if="stateDescription.startedAt">since {{ stateDescription.startedAt | date }}</span>
      </template>
      <template v-else-if="state === 'terminated'">
        Terminated
        <span v-if="stateDescription.finishedAt">at {{ stateDescription.finishedAt | date }}</span>
        <span v-if="stateDescription.exitCode">with exit code {{ stateDescription.exitCode }}</span>
        <span v-if="stateDescription.reason">({{ stateDescription.reason }})</span>
      </template>
      <template v-else>{{ state }}</template>
    </span>
  </div>
</template>

<script>
import { isEmpty } from 'lodash';

export default {
  name: 'KubernetesObjectDescribeContainerState',

  props: {
    containerState: { type: Object, default: () => [] },
  },

  methods: {
    isEmpty,
  },
};
</script>
