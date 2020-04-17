import { identity, iteratee } from 'lodash';

export default function arr2map(array = [], getKey = identity, getValue = identity) {
  return array.reduce((map, item) => {
    map.set(iteratee(getKey)(item), iteratee(getValue)(item));
    return map;
  }, new Map());
}
