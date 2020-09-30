/* eslint-disable no-else-return */
/* eslint-disable no-nested-ternary */
/* *
 *  把传入的时间戳与当前时间比较,计算几分钟前、几小时前、几天前，以及几分钟后、几小时后、几天前后
 *  unixtime 需要计算的时间戳，保留到毫秒 13位
 * */
import dayjs from 'dayjs';

export default function dateTimeFormat(date) {
  const currTime = dayjs();
  // eslint-disable-next-line
  const unixTime = dayjs(Math.floor(`${(isNaN(Number(date)) ? new Date(date) : new Date(Number(date))).getTime() * 1000}`.slice(0, 13)));
  // console.log(`${new Date(date).getTime() * 1000}`, unixTime);
  const time = currTime.isAfter(unixTime);
  const year = currTime.diff(unixTime, 'year');
  const month = currTime.diff(unixTime, 'month');
  const day = currTime.diff(unixTime, 'day');
  const hour = currTime.diff(unixTime, 'hour');
  const minute = currTime.diff(unixTime, 'minute');
  const second = currTime.diff(unixTime, 'second');

  if (time) {
    return year > 1 ? `${year}年前` : month > 1 ? `${month}月前` : day > 1 ? `${day}天前` : hour > 1 ? `${hour}小时前` : minute > 1 ? `${minute}分钟前` : `${second}秒前`;
  } else {
    return year > 1 ? `${year}年后` : month > 1 ? `${month}月后` : day > 1 ? `${day}天后` : hour > 1 ? `${hour}小时后` : minute > 1 ? `${minute}分钟后` : `${second}秒后`;
  }
}
