import store from '@/core/store';
import { get } from 'lodash';

export default function helpUrlFilter(key) {
  return get(store.state.helpURLDict[key], 'url');
}
