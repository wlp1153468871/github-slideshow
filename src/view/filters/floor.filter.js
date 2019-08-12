import { floor } from 'lodash';

export default function floorFilter(number, precision = 0) {
  return floor(number, precision);
}
