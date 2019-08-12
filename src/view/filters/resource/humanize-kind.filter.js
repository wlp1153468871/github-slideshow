// Changes "ReplicationController" to "replication controller".
// If useTitleCase, returns "Replication Controller".
import { startCase } from 'lodash';

export default function humanizeKindFilter(kind, useTitleCase) {
  if (!kind) {
    return kind;
  }

  if (kind === 'ServiceInstance') {
    return useTitleCase ? 'Provisioned Service' : 'provisioned service';
  }

  const humanized = startCase(kind);
  if (useTitleCase) {
    return humanized;
  }

  return humanized.toLowerCase();
}
