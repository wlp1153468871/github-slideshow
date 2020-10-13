/* eslint-disable no-else-return */
/* eslint-disable no-nested-ternary */
/* *
 *  返回两个时间之间的差值， 不需要区别开始和结束
 *  unixtime 需要计算的时间戳，保留到毫秒 13位
 * */
import dayjs from 'dayjs';

export default function dateDifference(start, end) {
  if (!start || !end) return '0分0秒';
  const dayMs = 24 * 60 * 60 * 1000;
  // eslint-disable-next-line
  const unix_start = dayjs(Math.floor(`${(isNaN(Number(start)) ? new Date(start) : new Date(Number(start))).getTime() * 1000}`.slice(0, 13)));
  // eslint-disable-next-line
  const unix_end = dayjs(Math.floor(`${(isNaN(Number(end)) ? new Date(end) : new Date(Number(end))).getTime() * 1000}`.slice(0, 13)));
  const unixTime = Math.abs(unix_start - unix_end);
  const day = Math.floor(unixTime / dayMs);
  const hourTime = unixTime % dayMs;
  const hour = Math.floor(hourTime / (60 * 60 * 1000));
  const minuteTime = hourTime % (60 * 60 * 1000);
  const minute = Math.floor(minuteTime / (60 * 1000));
  const second = (minuteTime % (60 * 1000)) / 1000;
  let str = '';
  if (day > 0) {
    str += `${day}天`;
  }
  if (hour > 0) {
    str += `${hour}小时`;
  }
  str += `${minute}分${second}秒`;
  return str;
}
