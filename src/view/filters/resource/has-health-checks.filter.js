import { every, get } from 'lodash';

export default function hasHealthChecks(podTemplate) {
  // Returns true if every container has a readiness or liveness probe.
  const containers = get(podTemplate, 'spec.containers', []);
  return every(containers, container => {
    return container.readinessProbe || container.livenessProbe;
  });
}
