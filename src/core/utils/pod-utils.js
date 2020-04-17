import { sum } from 'lodash';

export function getPodContainersReady(pod) {
  const isReady = cs => cs.ready || cs.start.running;
  const readyContainers = pod.status.containerStatuses.filter(isReady);
  return `${readyContainers.length} / ${pod.spec.containers.length}`;
}

/* eslint-disable prefer-destructuring */
export function getPodStatus(pod) {
  let hasRunning = false;
  let reason = pod.status.phase;

  if (pod.status.reason) {
    reason = pod.status.reason;
  }

  pod.status.containerStatuses.forEach(container => {
    if (container.state.waiting && container.state.waiting.reason !== '') {
      reason = container.state.waiting.reason;
    } else if (container.state.terminated && container.state.terminated.reason !== '') {
      reason = container.state.terminated.reason;
    } else if (container.state.terminated && container.state.terminated.reason === '') {
      if (container.state.terminated.signal !== 0) {
        reason = `Signal: ${container.state.terminated.signal}`;
      } else {
        reason = `ExitCode: ${container.state.terminated.exitCode}`;
      }
    } else if (container.ready && container.state.running) {
      hasRunning = true;
    }
  });

  if (reason === 'Completed' && hasRunning) {
    reason = 'Running';
  }

  if (pod.deletionTimestamp && pod.status.reason === 'NodeLost') {
    reason = 'Unknown';
  } else if (pod.deletionTimestamp) {
    reason = 'Terminating';
  }

  return reason;
}
/* eslint-enable prefer-destructuring */

export function getPodRestartCount(pod) {
  // every container status has restartCount
  return sum(pod.status.containerStatuses.map(cs => cs.restartCount));
}
