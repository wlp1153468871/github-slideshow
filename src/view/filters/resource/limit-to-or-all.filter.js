// Like limitTo, except if the limit is undefined, return all items instead of none.
// TODO: Remove when we upgrade Angular since you can pass undefined to limitTo in newer versions.
//       See https://github.com/angular/angular.js/pull/10510

import limitToFilter from '@/view/filters/resource/limit-to.filter';
import { isNaN } from 'lodash';

export default function limitToOrAllFilter(input, limit) {
  if (isNaN(limit)) {
    return input;
  }

  return limitToFilter(input, limit);
}
