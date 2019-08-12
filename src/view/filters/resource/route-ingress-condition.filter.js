import { find } from 'lodash';

export default function routeIngressConditionFilter(ingress, type) {
  if (!ingress) {
    return null;
  }
  return find(ingress.conditions, { type });
}
