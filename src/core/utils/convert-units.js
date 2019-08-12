import convert from 'convert-units';
import { round } from 'lodash';

export default function convertUnit(number, currentUnit = 'MB', originUnit = 'MB') {
  if (!number) return number;
  const dict = {
    M: 'MB',
    G: 'GB',
    T: 'TB',
  };
  return round(
    convert(number)
      .from(dict[originUnit.toUpperCase()] || originUnit)
      .to(dict[currentUnit.toUpperCase()] || currentUnit),
    1,
  );
}
