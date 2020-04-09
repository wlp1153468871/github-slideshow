<template>
  <!-- some states don't have their icons -->
  <svg :style="{ fill: color }" class="icon status-icon" :class="{ 'icon-spin': enableAnimation }">
    <use :xlink:href="icon"></use>
  </svg>
</template>

<script>
import { get as getValue } from 'lodash';

export default {
  name: 'StatusIcon',

  props: {
    status: String,
    enableAnimation: { type: Boolean, default: false },
  },

  data() {
    return {
      statusDict: {
        Cancelled: {
          icon: '#icon_block',
          color: '#9ba3af',
        },
        Complete: {
          icon: '#icon_checkmark',
          color: '#22c36a',
        },
        Completed: {
          icon: '#icon_checkmark',
          color: '#22c36a',
        },
        Active: {
          icon: '#icon_refresh',
          color: '#22c36a',
        },
        Error: {
          icon: '#icon_cross',
          color: '#f1483f',
        },
        Failed: {
          icon: '#icon_cross',
          color: '#f1483f',
        },
        New: {
          icon: '#icon_hourglass-o',
          color: '',
        },
        Pending: {
          icon: '#icon_hourglass-half',
          color: '#f7b32b',
        },
        Ready: {
          icon: '#icon_checkmark',
          color: '#22c36a',
        },
        Running: {
          icon: '#icon_refresh',
          color: '',
        },
        Succeeded: {
          icon: '#icon_checkmark',
          color: '#22c36a',
        },
        Bound: {
          icon: '#icon_checkmark',
          color: '#22c36a',
        },
        Terminating: {
          icon: '#icon_cross',
          color: '#f1483f',
        },
        Terminated: {
          icon: '#icon_cross',
          color: '#f1483f',
        },
        Unknown: {
          icon: '#icon_question-mark',
          color: '#f1483f',
        },
        // Container Runtime States
        'Init Error': {
          icon: '#icon_cross',
          color: '#f1483f',
        },
        ContainerCreating: {
          icon: '#icon_hourglass-half',
          color: '',
        },
        CrashLoopBackOff: {
          icon: '#icon_cross',
          color: '#f1483f',
        },
        ImagePullBackOff: {
          icon: '#icon_cross',
          color: '#f1483f',
        },
        ImageInspectError: {
          icon: '#icon_cross',
          color: '',
        },
        ErrImagePull: {
          icon: '#icon_cross',
          color: '#f1483f',
        },
        ErrImageNeverPull: {
          icon: '#icon_cross',
          color: '#f1483f',
        },
        'no matching container': {
          icon: '#icon_cross',
          color: '#f1483f',
        },
        RegistryUnavailable: {
          icon: '#icon_cross',
          color: '#f1483f',
        },
        RunContainerError: {
          icon: '#icon_cross',
          color: '#f1483f',
        },
        KillContainerError: {
          icon: '#icon_cross',
          color: '#f1483f',
        },
        VerifyNonRootError: {
          icon: '#icon_cross',
          color: '#f1483f',
        },
        SetupNetworkError: {
          icon: '#icon_cross',
          color: '#f1483f',
        },
        TeardownNetworkError: {
          icon: '#icon_cross',
          color: '#f1483f',
        },
        DeadlineExceeded: {
          icon: '#icon_cross',
          color: '#f1483f',
        },
        PodInitializing: {
          icon: '#icon_hourglass-half',
          color: '',
        },
      },
    };
  },

  computed: {
    color() {
      return getValue(this.statusDict[this.status], 'color');
    },
    icon() {
      return getValue(this.statusDict[this.status], 'icon');
    },
  },
};
</script>

<style lang="scss">
.icon.status-icon {
  width: 14px;
  height: 14px;
  margin-right: 5px;
}
</style>
