// Humanize duration values like 300 "seconds" as opposed to timestamps (see duration filter above).
// http://momentjs.com/docs/#/durations/

// TODO fix this
import dayjs from 'dayjs';

export default function humanizeDurationValue(duration) {
  return dayjs(dayjs() - duration).fromNow();
}
