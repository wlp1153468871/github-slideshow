import dayjs from 'dayjs';

/**
 * begin from end;
 * @param {Number} begin timestamp
 * @param {Number} end timestamp
 * @param flat: false表示是Unix time
 */
function dateFromFilter(begin, end, flat) {
  let targetBegin;
  let targetEnd;
  if (flat) {
    targetBegin = dayjs(begin);
    targetEnd = end ? dayjs(end) : dayjs();
  } else {
    targetBegin = dayjs.unix(begin);
    targetEnd = end ? dayjs.unix(end) : dayjs();
  }
  return targetEnd.from(targetBegin, true);
}

export default dateFromFilter;
