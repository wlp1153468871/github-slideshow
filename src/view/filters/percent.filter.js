import { round } from 'lodash';

export default function percentFilter(number, precision = 2) {
  return `${round(Number(number) * 100, precision)}%`;
}
