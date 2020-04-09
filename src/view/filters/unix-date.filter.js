import dayjs from 'dayjs';

export default function unixDateFilter(timestamp, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs.unix(timestamp).format(pattern);
}
