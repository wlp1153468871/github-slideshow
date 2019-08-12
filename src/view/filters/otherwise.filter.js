import { isNil } from 'lodash';

export default function otherwiseFilter(value, str = '-') {
  return isNil(value) || value === '' ? str : value;
}
