import * as types from '@/core/store/mutation-types';
import saveRefreshTime from '@/core/utils/refresh-time';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import store from '@/core/store';
import AuthService from '@/core/services/auth.service';
import Vue from 'vue';
import { get as getValue } from 'lodash';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

export default function ensureHooks(router) {
  router.beforeEach((to, from, next) => {
    saveRefreshTime();
    NProgress.start(); // start progress bar
    if (AuthService.isAuthed()) {
      if (to.name === 'login') {
        next({ name: 'console.dashboard' });
        NProgress.done();
      } else if (!store.state.user.id) {
        store
          .dispatch('getUserInfo')
          .then(() => {
            const redirect = decodeURIComponent(from.query.redirect || to.path);
            if (to.path === redirect) {
              next({ ...to, replace: true });
            } else {
              next({ path: redirect });
            }
          })
          .catch(() => {
            Vue.noty.error('请求用户信息失败，请重试');
            store.dispatch('logout').then(() => {
              next({ name: 'login', query: { redirect: to.fullPath } });
            });
          });
      } else {
        next();
      }
    } else if (to.meta.public) {
      next();
    } else {
      next({ name: 'login' });
      // if current page is login will not trigger afterEach hook, so manually handle it
      NProgress.done();
    }
  });

  router.afterEach(to => {
    const routes = to.matched.concat();
    const routeName = to.name;
    const isInstanceList =
      routeName === 'console.instances' || routeName === 'console.instance';

    let activeMenu = 'console.dashboard';

    if (routes.length >= 4) {
      routes.pop();
      activeMenu = routes[2].name;
    } else {
      const metaActiveName =
        getValue(to, 'meta.activeMenu') || getValue(routes.pop(), 'name');

      if (isInstanceList) {
        activeMenu = `${metaActiveName}/${to.params.serviceId}`;
      } else {
        activeMenu = metaActiveName;
      }
    }
    store.commit(types.SET_DEFAULT_ACTIVE_MENU, activeMenu);
    NProgress.done(); // finish progress bar
  });
}
