import store from '@/core/store';


// function getMenus() {
//   const allMenus = [...store.state.zoneMenus, ...store.state.spaceMenus];
//   return allMenus;
// }
export default function hasPermission(menu) {
  const { code } = menu.meta;
  if (!code) return false;
  return store.state.zoneMenus.indexOf(code) > -1 || store.state.spaceMenus.indexOf(code) > -1;
}
