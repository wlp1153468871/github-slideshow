import { startCase } from 'lodash';

export default function camelToLowerFilter(str) {
  if (!str) {
    return '';
  }

  return startCase(str).toLowerCase();
}
