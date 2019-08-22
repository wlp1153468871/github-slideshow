import store from '@/core/store';
import NProgress from 'nprogress';
import ManageContainer from '@/view/pages/manage/container/container.vue';
import DeployContainer from '@/view/pages/deploy/container/container.vue';

const QuotaField = () => import(/* webpackChunkName: "management" */'@/view/pages/manage/quota/quota-field/quota-field.vue');
const OrgQuotaGroup = () => import(/* webpackChunkName: "management" */'@/view/pages/manage/quota/org-quota-group/org-quota-group.vue');
const SpaceQuotaGroup = () => import(/* webpackChunkName: "management" */'@/view/pages/manage/quota/space-quota-group/space-quota-group.vue');
const SpaceQuotaGroupDetail = () => import(/* webpackChunkName: "management" */'@/view/pages/manage/quota/space-quota-group-detail/space-quota-group-detail.vue');
const BrokerServiceDetail = () => import(/* webpackChunkName: "management" */'@/view/pages/manage/broker-service/service-detail/service-detail.vue');
const ServiceList = () => import(/* webpackChunkName: "management" */'@/view/pages/manage/service/service-list/service-list.vue');
const ServiceDetail = () => import(/* webpackChunkName: "management" */'@/view/pages/manage/service/service-detail/service-detail.vue');
const OrgDetail = () => import(/* webpackChunkName: "management" */'@/view/pages/manage/org/org-detail/org-detail.vue');
const OrgList = () => import(/* webpackChunkName: "management" */'@/view/pages/manage/org/org-list/org-list.vue');
const SpaceDetail = () => import(/* webpackChunkName: "management" */'@/view/pages/manage/org/space-detail/space-detail.vue');
const UserList = () => import(/* webpackChunkName: "management" */'@/view/pages/manage/user/user-list/user-list.vue');
const ZoneList = () => import(/* webpackChunkName: "management" */'@/view/pages/manage/zone/zone-list/zone-list.vue');
const ZoneDetail = () => import(/* webpackChunkName: "management" */'@/view/pages/manage/zone/zone-detail/zone-detail.vue');

// preference
const HomeSetting = () => import(/* webpackChunkName: "management" */'@/view/pages/manage/preference/home/home.vue');
const Preference = () => import(/* webpackChunkName: "management" */'@/view/pages/manage/preference/preference/preference.vue');
const Appearance = () => import(/* webpackChunkName: "management" */'@/view/pages/manage/preference/appearance/appearance.vue');
const SSO = () => import(/* webpackChunkName: "management" */'@/view/pages/manage/preference/sso/sso.vue');
const HelpInfoConfig = () => import(/* webpackChunkName: "management" */'@/view/pages/manage/preference/help-info-config/help-info-config.vue');
const DeployZone = () => import(/* webpackChunkName: "management" */'@/view/pages/manage/zone/deploy/deploy.vue');

export default {
  path: '/manage',
  name: 'manage',
  beforeEnter(to, from, next) {
    if (store.getters.isPlatformAdmin) {
      next();
    } else {
      next({
        name: 'console.dashboard',
      });
      NProgress.done();
    }
  },
  redirect: {
    name: 'manage.org.list',
  },
  component: ManageContainer,
  children: [
    {
      path: 'broker-service/:service',
      name: 'manage.broker-service.detail',
      component: BrokerServiceDetail,
    },
    {
      path: 'service',
      name: 'manage.service.list',
      component: ServiceList,
    },
    {
      path: 'service/:id',
      name: 'manage.service.detail',
      component: ServiceDetail,
      meta: {
        activeMenu: 'manage.service.list',
      },
    },
    {
      path: 'org',
      name: 'manage.org.list',
      component: OrgList,
    },
    {
      path: 'org/:org',
      name: 'manage.org.detail',
      component: OrgDetail,
    },
    {
      path: 'org/:org/space/:space',
      name: 'manage.org.space',
      component: SpaceDetail,
    },
    {
      path: 'user',
      name: 'manage.user.list',
      component: UserList,
    },
    {
      path: 'zone',
      name: 'manage.zone.list',
      component: ZoneList,
    },
    {
      path: 'zone/:zone',
      name: 'manage.zone.detail',
      component: ZoneDetail,
      meta: {
        activeMenu: 'manage.zone.list',
      },
    },
    {
      path: 'quota-field',
      name: 'manage.quota.list',
      component: QuotaField,
    },
    {
      path: 'quota-group',
      name: 'manage.quota.group',
      component: OrgQuotaGroup,
    },
    {
      path: 'quota-group/org',
      name: 'manage.quota.org-group',
      component: SpaceQuotaGroup,
    },
    {
      path: 'quota-group/:org',
      name: 'manage.quota.space-group-detail',
      component: SpaceQuotaGroupDetail,
    },
    {
      path: 'setting',
      name: 'manage.preference',
      component: Preference,
      redirect: {
        name: 'manage.preference.home',
      },
      children: [
        {
          path: 'home',
          name: 'manage.preference.home',
          component: HomeSetting,
        },
        {
          path: 'appearance',
          name: 'manage.preference.appearance',
          component: Appearance,
        },
        {
          path: 'sso',
          name: 'manage.preference.sso',
          component: SSO,
        },
        {
          path: 'help-info-config',
          name: 'manage.preference.help-info-config',
          component: HelpInfoConfig,
        },
      ],
    },

    {
      path: 'deploy',
      name: 'manage.deploy',
      component: DeployContainer,
      children: [
        {
          path: 'zone',
          name: 'deploy.zone',
          component: DeployZone,
        },
      ],
    },
  ],
};
