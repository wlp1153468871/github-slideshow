
/**
 * list = [1, 2,2, 3,3, 4]
 * compare = (x, y) => x === y;
 * will get [[1], [2,2,], [3,3,], [4]];
 * @param {Array<any>} list
 * @param {Function} compare
 * @param {Number} limit
 */
export default function combine(list, compare, limit = 10) {
  const result = [];
  const iterator = list[Symbol.iterator]();

  let done = false;
  let current = iterator.next();

  while (!done && result.length <= limit) {
    if (current.done) {
      done = current.done; // eslint-disable-line
    } else {
      const next = iterator.next();

      if (compare(current.value, next.value)) {
        result.push([current.value, next.value]);
        done = next.done; // eslint-disable-line
        if (!done) current = iterator.next();
      } else {
        result.push([current.value]);
        done = current.done; // eslint-disable-line
        current = next;
      }
    }
  }

  return result;
}
