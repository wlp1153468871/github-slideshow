import { get } from 'lodash';

export default function numContainersReady(pod) {
  let numReady = 0;
  const containerStatuses = get(pod, 'status.containerStatuses');
  if (containerStatuses) {
    containerStatuses.forEach(status => {
      if (status.ready) {
        numReady += 1;
      }
    });
  }

  return numReady;
}
