import Vue from 'vue';
import Router from 'vue-router';

// home
import Home from '@/view/pages/home/home.vue';
// login
import Login from '@/view/pages/login/login.vue';

import ProductRouters from './product';
import ConsoleRouters from './console';
import ManageRouters from './manager';

import guards from './guards';

Vue.use(Router);

const router = new Router({
  linkActiveClass: 'active',
  scrollBehavior(to, from, savedPosition) {
    console.log(savedPosition);
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
    ConsoleRouters,

    // path: /manage'
    ManageRouters,

    {
      path: '/403',
      name: '403',
      component: () =>
        import(/* webpackChunkName: "fail" */ '@/view/pages/exception/403.vue'),
    },

    {
      path: '*',
      component: () =>
        import(/* webpackChunkName: "fail" */ '@/view/pages/exception/404.vue'),
    },
  ],
});

// global interceptor
guards(router);

export default router;
