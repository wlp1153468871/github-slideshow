<template>
  <div class="panel-resource">
    <h3>Status</h3>

    <div class="panel-resource-content content-bordered">
      <div class="dl-horizontal dl-bordered">
        <dl>
          <div class="dl-item">
            <dt>状态:</dt>
            <dd :class="pod | pod_status">
              <status-icon :enable-animation="enableAnimation" :status="pod | pod_status">
              </status-icon>
              {{ pod | pod_status | humanize_pod_status }}
              <span v-if="podCompletionTime">, 已运行 {{ podStartTimeFromCompletionTime }}</span>
              <span v-if="pod.metadata.deletionTimestamp">
                (过期于 {{ pod.metadata.deletionTimestamp | date }})
              </span>
            </dd>
          </div>
          <div class="dl-item" v-if="pod.status.message">
            <dt>Message:</dt>
            <dd>{{ pod.status.message }}</dd>
          </div>
          <div class="dl-item" v-if="dcName">
            <dt>
              Deployment:
            </dt>
            <dd>
              <span>{{ dcName }}</span>
              <span v-if="rcName"
                >,<span v-if="deploymentVersion">#{{ deploymentVersion }}</span>
                <span v-if="!deploymentVersion">{{ rcName }}</span>
              </span>
            </dd>
          </div>
          <div class="dl-item" v-if="!dcName && controllerRef">
            <dt>{{ controllerRef.kind | humanize_kind(true) }}:</dt>
            <dd>
              {{ controllerRef.name }}
            </dd>
          </div>
          <div
            class="dl-item"
            v-if="pod.metadata.deletionTimestamp && pod.spec.terminationGracePeriodSeconds"
          >
            <dt>Grace Period:</dt>
            <dd>
              <!-- Don't show "a few seconds" for small values. -->
              <span v-if="pod.spec.terminationGracePeriodSeconds < 60">
                {{ pod.spec.terminationGracePeriodSeconds }} seconds
              </span>
              <span v-if="pod.spec.terminationGracePeriodSeconds >= 60">
                {{ pod.spec.terminationGracePeriodSeconds | humanize_duration_value }}
              </span>
            </dd>
          </div>
          <div class="dl-item">
            <dt>IP:</dt>
            <dd>{{ pod.status.podIP || 'unknown' }}</dd>
          </div>
          <div class="dl-item">
            <dt>Node:</dt>
            <dd>
              {{ pod.spec.nodeName || 'unknown' }}
              <span v-if="pod.status.hostIP && pod.spec.nodeName !== pod.status.hostIP">
                ({{ pod.status.hostIP }})
              </span>
            </dd>
          </div>
          <div class="dl-item">
            <dt>重启策略:</dt>
            <dd>{{ pod.spec.restartPolicy || 'Always' }}</dd>
          </div>
          <div class="dl-item" v-if="pod.spec.activeDeadlineSeconds">
            <dt>Active Deadline:</dt>
            <dd>
              <!-- Don't show "a few seconds" for small values. -->
              <span v-if="pod.spec.activeDeadlineSeconds < 60">
                {{ pod.spec.activeDeadlineSeconds }} seconds
              </span>
              <span v-if="pod.spec.activeDeadlineSeconds >= 60">
                {{ pod.spec.activeDeadlineSeconds | humanize_duration_value }}
              </span>
              <span
                v-if="pod.status.phase === 'Running' && pod.status.startTime"
                class="text-muted"
              >
                (<span class="duration">{{ pod.status.startTime | date_from(null, true) }} </span>
                elapsed)
              </span>
            </dd>
          </div>
        </dl>

        <container-statuses :pod="pod" :detailed="true"> </container-statuses>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { filter, get as getValue, find } from 'lodash';
import ContainerStatuses from './container-statuses';

export default {
  name: 'StatusPanel',

  components: {
    ContainerStatuses,
  },

  props: {
    pod: { type: Object, default: () => ({}) },
  },

  data() {
    return {
      annotation: Vue.filter('annotation'),
    };
  },

  methods: {},

  computed: {
    dcName() {
      return this.annotation(this.pod, 'deploymentConfig');
    },

    rcName() {
      return this.annotation(this.pod, 'deployment');
    },

    enableAnimation() {
      return Vue.filter('pod_status')(this.pod) === 'Running';
    },

    deploymentVersion() {
      return this.annotation(this.pod, 'deploymentVersion');
    },

    logCanRun() {
      return !['New', 'Pending', 'Unknown'].includes(this.pod.status.phase);
    },

    podCompletionTime() {
      return Vue.filter('pod_completion_time')(this.pod);
    },

    controllerRef() {
      const ownerReferences = getValue(this.pod, 'metadata.ownerReferences');
      const controllerReferences = filter(ownerReferences, 'controller');
      return find(controllerReferences, ref => {
        return (
          ref.kind === 'ReplicationController' ||
          ref.kind === 'ReplicaSet' ||
          ref.kind === 'Build' ||
          ref.kind === 'StatefulSet'
        );
      });
    },

    podStartTimeFromCompletionTime() {
      if (this.podCompletionTime) {
        const podStartTime = Vue.filter('pod_start_time')(this.pod);
        const podCompletionTime = Vue.filter('pod_completion_time')(this.pod);
        return Vue.filter('date_from')(podStartTime, podCompletionTime, true);
      }
      return null;
    },
  },
};
</script>
<style lang="scss">
.panel-resource{
  .dl-item{
    .Running, .Ready{
      color: #22c36a;
    }
    .Pending{
      color: #f7b32b;
    }
    .Failed, .Error{
      color: #f1483f;
    }
  }
}
</style>
