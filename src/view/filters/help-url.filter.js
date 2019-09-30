import store from '@/core/store';

export default function helpUrlFilter(key) {
  return store.state.helpURLDict[key];
}
