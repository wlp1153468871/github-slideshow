import store from '@/core/store';

export default function hasPermission(menu) {
  const { code } = menu.meta;
  if (!code) return false;
  return store.getters.menus.indexOf(code) > -1;
}
