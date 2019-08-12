import camelToLowerFilter from '@/view/filters/camel-to-lower.filter';
import { upperFirst } from 'lodash';

export default function sentenceCaseFilter(str) {
  const lower = camelToLowerFilter(str);
  return upperFirst(lower);
}
