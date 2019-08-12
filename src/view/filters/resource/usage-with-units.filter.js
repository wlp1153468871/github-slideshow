import { spread } from 'lodash';

const humanizeUnitFilter = (unit, type, singular) => {
  switch (type) {
    case 'memory':
    case 'limits.memory':
    case 'requests.memory':
    case 'storage': {
      if (!unit) {
        return unit;
      }
      return `${unit}B`;
    }
    case 'cpu':
    case 'limits.cpu':
    case 'requests.cpu': {
      if (unit === 'm') {
        unit = 'milli';
      }
      const suffix = singular ? 'core' : 'cores';
      return (unit || '') + suffix;
    }
    default:
      return unit;
  }
};

const amountAndUnitFilter = (value, type, humanizeUnits) => {
  if (!value) {
    return [value, null];
  }
  const split = /(-?[0-9.]+)\s*(.*)/.exec(value);
  if (!split) {
    // We didn't get an amount? shouldn't happen but just in case
    return [value, null];
  }

  const amount = split[1];
  let unit = split[2];
  if (humanizeUnits) {
    unit = humanizeUnitFilter(unit, type, amount === '1');
  }

  return [amount, unit];
};

export default function usageWithUnitsFilter(value, type) {
  const toString = spread((amount, unit) => {
    if (!unit) {
      return amount;
    }

    return `${amount} ${unit}`;
  });

  return toString(amountAndUnitFilter(value, type, true));
}
