import { get as getValue, some } from 'lodash';

export default function routeHostFilter(route, onlyAdmitted) {
  if (!getValue(route, 'status.ingress')) {
    return getValue(route, 'spec.host');
  }

  if (!route.status.ingress) {
    return route.spec.host;
  }
  let oldestAdmittedIngress = null;
  route.status.ingress.forEach(ingress => {
    if (
      some(ingress.conditions, { type: 'Admitted', status: 'True' }) &&
      (!oldestAdmittedIngress ||
        oldestAdmittedIngress.lastTransitionTime > ingress.lastTransitionTime)
    ) {
      oldestAdmittedIngress = ingress;
    }
  });

  if (oldestAdmittedIngress) {
    return oldestAdmittedIngress.host;
  }

  return onlyAdmitted ? null : route.spec.host;
}
