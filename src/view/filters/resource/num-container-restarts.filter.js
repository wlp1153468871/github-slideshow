import { get } from 'lodash';

export default function numContainerRestarts(pod) {
  let numRestarts = 0;
  const containerStatuses = get(pod, 'status.containerStatuses');
  if (containerStatuses) {
    containerStatuses.forEach(status => {
      numRestarts += status.restartCount;
    });
  }
  return numRestarts;
}
