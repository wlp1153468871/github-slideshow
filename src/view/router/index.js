import Vue from 'vue';
import Router from 'vue-router';
import NProgress from 'nprogress';

// container
import ConsoleContainer from '@/view/pages/console/container/container.vue';
import ManageContainer from '@/view/pages/manage/container/container.vue';

// home
import Home from '@/view/pages/home/home.vue';
// login
import Login from '@/view/pages/login/login.vue';

import store from '@/core/store';
import OrgService from '@/core/services/org.service';
import SpaceService from '@/core/services/space.service';
import ZoneService from '@/core/services/zone.service';

import ProductRouters from './product';
import ConsoleRouters from './console';
import ManageRouters from './manage';

import guards from './guards';

Vue.use(Router);

const router = new Router({
  linkActiveClass: 'active',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        public: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        public: true,
      },
    },
    // path: '/product'
    ProductRouters,

    // path: '/console'
    // ConsoleRouters,
    {
      path: '/console',
      name: 'console',
      component: ConsoleContainer,
      children: ConsoleRouters,
      redirect: {
        name: 'console.gateway',
      },
      beforeEnter(to, from, next) {
        const { spaceId, zoneId, orgId } = to.query;
        if (spaceId && zoneId && orgId) {
          SpaceService.setLocalSpace({
            id: spaceId,
          });
          ZoneService.setLocalZone({
            id: zoneId,
          });
          OrgService.setLocalOrg({
            id: orgId,
          });
        }

        if (to.query.onInitTenantView) {
          next();
        } else {
          store.dispatch('initTenantView').finally(() => {
            next();
          });
        }
      },
    },

    // path: /manage'
    {
      path: '/manage',
      name: 'manage',
      beforeEnter(to, from, next) {
        store.dispatch('getUserInfo').finally(() => {
          if (store.getters.isPlatformAdmin) {
            next();
          } else {
            Vue.noty.error('无平台管理权限');
            next({
              name: 'console.gateway',
            });
            NProgress.done();
          }
        });
      },
      redirect: {
        name: 'manage.org.list',
      },
      component: ManageContainer,
      children: ManageRouters,
    },
    // ManageRouters,
    {
      path: '/403',
      name: '403',
      component: () => import(/* webpackChunkName: "fail" */ '@/view/pages/exception/403.vue'),
    },

    {
      path: '*',
      component: () => import(/* webpackChunkName: "fail" */ '@/view/pages/exception/404.vue'),
    },
  ],
});

// global interceptor
guards(router);

export default router;
