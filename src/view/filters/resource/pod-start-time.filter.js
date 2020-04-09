import dayjs from 'dayjs';
import { get } from 'lodash';

export default function podStartTimeFilter(pod) {
  let earliestStartTime = null;
  const containerStatuses = get(pod, 'status.containerStatuses');

  containerStatuses.forEach(containerStatus => {
    const status =
      get(containerStatus, 'state.running') || get(containerStatus, 'state.terminated');
    if (!status) {
      return;
    }
    if (!earliestStartTime || dayjs(status.startedAt).isBefore(earliestStartTime)) {
      earliestStartTime = status.startedAt;
    }
  });

  return earliestStartTime;
}
