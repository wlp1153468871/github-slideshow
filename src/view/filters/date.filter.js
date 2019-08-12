import dayjs from 'dayjs';

export default function formatFilter(date, pattern = 'YYYY-MM-DD HH:mm:ss') {
  if (date) {
    return dayjs(date).format(pattern);
  }

  return date;
}
