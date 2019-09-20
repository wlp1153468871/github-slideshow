import { round } from 'lodash';

export function gib2byte(gib, type = null) {
  if (type === 'CPU') {
    return round(parseFloat(gib) * 1000, 3).toString();
  }
  return round((parseFloat(gib) * (1024 ** 3)), 0).toString();
}


export function byte2gib(gib, type = null) {
  if (type === 'CPU') {
    return round(parseFloat(gib) / 1000, 3).toString();
  }
  return round((parseFloat(gib) / (1024 ** 3)), 3).toString();
}
