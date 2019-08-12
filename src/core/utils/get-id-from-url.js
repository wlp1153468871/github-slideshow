import { uniq } from 'lodash';

/**
 * http://123.59.45.173:30037/api-stream/containers-utils/stats?
 * Host=http://123.59.45.157:30040&
 * Container=0436b83992591550433783a56d26fd17ed03521e65e4031881dd6a782a9ee134&
 * Container=5d624d37739ccd3b0e58fe2867f6d27983acd8efa362007f7568757c689dbc5d&
 * Container=6ba53f2fedb8ae75ecf770e008e246786384a88ef6ac0b20cc175445f5bd0773
 * @param {String} url
 * @param key
 */
export default function getIdFromURL(url = '', key = 'Container') {
  const [host, queryStr] = url.split('?'); // eslint-disable-line
  const querys = queryStr.split('&');
  const keyList = [];
  querys.forEach(x => {
    const splitIndex = x.indexOf('=');
    if (x.slice(0, splitIndex) === key) {
      keyList.push(x.slice(splitIndex + 1));
    }
  });
  return uniq(keyList);
}
