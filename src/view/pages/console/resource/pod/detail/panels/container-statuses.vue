<template>
  <div>
    <div
      v-for="(containerStatus, index) in pod.status.containerStatuses"
      :key="index">
      <h4>Container {{containerStatus.name}}</h4>

      <dl class="dl-horizontal">
        <div class="dl-item">
          <dt>State:</dt>
          <dd>
            <kubernetes-object-describe-container-state
              :container-state="containerStatus.state">
            </kubernetes-object-describe-container-state>
          </dd>
        </div>
        <div class="dl-item" v-if="!isEmpty(containerStatus.lastState)">
          <dt>Last State</dt>
          <dd>
            <kubernetes-object-describe-container-state
              :container-state="containerStatus.lastState">
            </kubernetes-object-describe-container-state>
          </dd>
        </div>
        <div class="dl-item">
          <dt>Ready:</dt>
          <dd>{{containerStatus.ready}}</dd>
        </div>
        <div class="dl-item">
          <dt>Restart Count:</dt>
          <dd>{{containerStatus.restartCount}}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script>
import getPreferredVersion from '@/core/utils/get-preferred-version';
import { isEmpty } from 'lodash';

export default {
  name: 'ContainerStatuses',

  props: {
    pod: { type: Object, default: () => ({}) },
    detailed: { type: Boolean, default: () => false },
  },

  data() {
    return {
      podsVersion: getPreferredVersion('pods'),
    };
  },

  methods: {
    isEmpty,
  },
};
</script>
