import { transform, isEqual, isObject } from 'lodash';

export default function difference(prev, next) {
  function changes(object, base) {
    return transform(object, (result, value, key) => {
      if (!isEqual(value, base[key])) {
        result[key] = (isObject(value) && isObject(base[key]))
          ? changes(value, base[key])
          : value;
      }
    });
  }
  return changes(prev, next);
}
