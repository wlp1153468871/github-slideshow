import { floor } from 'lodash';

const RADIX = {
  G: 1024 ** 3,
  M: 1024 ** 2,
  K: 1024,
};

/**
 * parse storage w/ given unit
 * @param {*} size storage size
 * @param {*} unit unit you want to parse
 * @param {*} precision precision
 */
function storageFilter(size = 0, unit = 'K', precision = 2) {
  return `${floor(size / RADIX[unit], precision)}${unit}`;
}

export default storageFilter;
