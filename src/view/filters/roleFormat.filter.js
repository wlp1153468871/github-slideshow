import { isNil } from 'lodash';

export default function roleformatFilter(value, str = '无权限') {
  return isNil(value) || value === '' ? str : value;
}
