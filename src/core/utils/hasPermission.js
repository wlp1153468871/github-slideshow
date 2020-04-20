import store from '@/core/store';

export default function hasPermission(menu) {
  const { code } = menu.meta;
  if (!code) return true;
  const codes = code.split(';');
  return store.getters.pages.some(m => codes.some(c => c === m));
}
