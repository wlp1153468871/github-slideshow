import dayjs from 'dayjs';
import { get } from 'lodash';

export default function podCompletionTimeFilter(pod) {
  let lastFinishTime = null;
  const containerStatuses = get(pod, 'status.containerStatuses', []);

  containerStatuses.forEach(containerStatus => {
    const status = get(containerStatus, 'state.terminated');
    if (!status) {
      return;
    }
    if (!lastFinishTime || dayjs(status.finishedAt).isAfter(lastFinishTime)) {
      lastFinishTime = status.finishedAt;
    }
  });
  return lastFinishTime;
}
