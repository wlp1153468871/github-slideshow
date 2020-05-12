import { get as getValue } from 'lodash';

export default function podStatus(pod) {
  // Return results that match
  // https://github.com/openshift/origin/blob/master/vendor/k8s.io/kubernetes/pkg/printers/internalversion/printers.go#L523-L615
  if (!pod || (!pod.metadata.deletionTimestamp && !pod.status)) {
    return '';
  }

  if (pod.metadata.deletionTimestamp) {
    return 'Terminating';
  }

  let initializing = false;
  let reason;

  // Print detailed container reasons if available. Only the first will be
  // displayed if multiple containers have this detail.

  if (pod.status.initContainerStatuses) {
    pod.status.initContainerStatuses.forEach(initContainerStatus => {
      const initContainerState = getValue(initContainerStatus, 'state');

      if (initContainerState.terminated && initContainerState.terminated.exitCode === 0) {
        // initialization is complete
        return;
      }

      if (initContainerState.terminated) {
        // initialization is failed
        if (!initContainerState.terminated.reason) {
          if (initContainerState.terminated.signal) {
            reason = `Init Signal: ${initContainerState.terminated.signal}`;
          } else {
            reason = `Init Exit Code: ${initContainerState.terminated.exitCode}`;
          }
        } else {
          reason = `Init ${initContainerState.terminated.reason}`;
        }
        initializing = true;
        // eslint-disable-next-line consistent-return
        return true;
      }

      if (
        initContainerState.waiting &&
        initContainerState.waiting.reason &&
        initContainerState.waiting.reason !== 'PodInitializing'
      ) {
        reason = `Init ${initContainerState.waiting.reason}`;
        initializing = true;
      }
    });
  }

  if (!initializing) {
    reason = pod.status.reason || pod.status.phase;
    if (pod.status.containerStatuses) {
      pod.status.containerStatuses.forEach(containerStatus => {
        // eslint-disable-next-line prefer-const
        const containerReason =
          getValue(containerStatus, 'state.waiting.reason') ||
          getValue(containerStatus, 'state.terminated.reason');

        if (containerReason) {
          reason = containerReason;
          return true;
        }

        const signal = getValue(containerStatus, 'state.terminated.signal');
        if (signal) {
          reason = `Signal: ${signal}`;
          return true;
        }

        const exitCode = getValue(containerStatus, 'state.terminated.exitCode');
        if (exitCode) {
          reason = `Exit Code: ${exitCode}`;
          return true;
        }

        return true;
      });
    }
  }

  return reason;
}
