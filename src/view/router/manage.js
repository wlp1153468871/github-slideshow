import DeployContainer from '@/view/pages/deploy/container/container.vue';
import RouteView from '@/view/layout/route-view';
import NoSideContainer from '@/view/pages/console/form-container/container.vue';
import ZoneNewApp from '@/view/pages/manage/zone/zone-detail/panels/new-app.vue';

const QuotaField = () =>
  import(/* webpackChunkName: "management" */ '@/view/pages/manage/quota/quota-field/quota-field.vue');
const OrgQuotaGroup = () =>
  import(/* webpackChunkName: "management" */ '@/view/pages/manage/quota/org-quota-group/org-quota-group.vue');
const SpaceQuotaGroup = () =>
  import(/* webpackChunkName: "management" */ '@/view/pages/manage/quota/space-quota-group/space-quota-group.vue');
const SpaceQuotaGroupDetail = () =>
  import(/* webpackChunkName: "management" */ '@/view/pages/manage/quota/space-quota-group-detail/space-quota-group-detail.vue');
const BrokerServiceDetail = () =>
  import(/* webpackChunkName: "management" */ '@/view/pages/manage/broker-service/service-detail/service-detail.vue');
const ServiceList = () =>
  import(/* webpackChunkName: "management" */ '@/view/pages/manage/service/service-list/service-list.vue');
const ServiceDetail = () =>
  import(/* webpackChunkName: "management" */ '@/view/pages/manage/service/service-detail/service-detail.vue');
const OrgDetail = () =>
  import(/* webpackChunkName: "management" */ '@/view/pages/manage/org/org-detail/org-detail.vue');
const OrgList = () =>
  import(/* webpackChunkName: "management" */ '@/view/pages/manage/org/org-list/org-list.vue');
const SpaceDetail = () =>
  import(/* webpackChunkName: "management" */ '@/view/pages/manage/org/space-detail/space-detail.vue');
const UserList = () =>
  import(/* webpackChunkName: "management" */ '@/view/pages/manage/user/user-list/user-list.vue');
const ZoneList = () =>
  import(/* webpackChunkName: "management" */ '@/view/pages/manage/zone/zone-list/zone-list.vue');
const ZoneDetail = () =>
  import(/* webpackChunkName: "management" */ '@/view/pages/manage/zone/zone-detail/zone-detail.vue');
const AlarmMetricsList = () =>
  import(/* webpackChunkName: "management" */ '@/view/pages/manage/alarm/alarm-metrics/alarm-metrics.vue');
const AuthContainer = () =>
  import(/* webpackChunkName: "management" */ '@/view/pages/manage/auth/container.vue');
const AuthRoles = () =>
  import(/* webpackChunkName: "management" */ '@/view/pages/manage/auth/roles.vue');
const Application = () =>
  import(/* webpackChunkName: "management" */ '@/view/pages/manage/application/application.vue');
const CreateApp = () =>
  import(/* webpackChunkName: "management" */ '@/view/pages/manage/application/app/app.vue');
const ApplicationDetail = () =>
  import(/* webpackChunkName: "management" */ '@/view/pages/manage/application/detail/detail.vue');
const AdminInstance = () =>
  import(/* webpackChunkName: "management" */ '@/view/pages/manage/application/instance/instance.vue');

// preference
const HomeSetting = () =>
  import(/* webpackChunkName: "management" */ '@/view/pages/manage/preference/home/home.vue');
const Preference = () =>
  import(/* webpackChunkName: "management" */ '@/view/pages/manage/preference/preference/preference.vue');
const Appearance = () =>
  import(/* webpackChunkName: "management" */ '@/view/pages/manage/preference/appearance/appearance.vue');
const SSO = () =>
  import(/* webpackChunkName: "management" */ '@/view/pages/manage/preference/sso/sso.vue');
const HelpInfoConfig = () =>
  import(/* webpackChunkName: "management" */ '@/view/pages/manage/preference/help-info-config/help-info-config.vue');
const DeployZone = () =>
  import(/* webpackChunkName: "management" */ '@/view/pages/manage/zone/deploy/deploy.vue');


export default [
  {
    path: '/manage',
    name: 'account-permissions',
    component: RouteView,
    meta: {
      hidden: false,
      icon: '#icon_file-text',
      title: '账号与管理',
      code: 'platform.organization;platform.user;platform.rolePermission;platform.applications',
      type: 'submenu',
    },
    children: [
      {
        path: 'org',
        name: 'manage.org.list',
        component: OrgList,
        meta: {
          icon: '#icon_users',
          title: '组织管理',
          code: 'platform.organization;platform.applications',
          hidden: false,
        },
        children: [],
      },
      {
        path: 'org/:org',
        name: 'manage.org.detail',
        component: OrgDetail,
        meta: {
          activeMenu: 'manage.org.list',
          hidden: true,
          code: 'platform.organization',
        },
      },
      {
        path: 'org/:org/space/:space',
        name: 'manage.org.space',
        component: SpaceDetail,
        meta: {
          activeMenu: 'manage.org.list',
          hidden: true,
          code: 'platform.organization',
        },
      },
      {
        path: 'user',
        name: 'manage.user.list',
        component: UserList,
        meta: {
          icon: '#icon_users',
          title: '用户管理',
          code: 'platform.user',
          hidden: false,
        },
      },
      {
        path: 'auth',
        name: 'manage.auth',
        component: AuthContainer,
        redirect: {
          name: 'manage.auth.roles',
          params: { scope: 'platform' },
        },
        meta: {
          icon: '#icon_users',
          title: '权限角色',
          code: 'platform.rolePermission',
          params: {
            scope: 'platform',
          },
          activeMenu: 'manage.auth',
          hidden: false,
        },
        children: [
          {
            path: ':scope',
            name: 'manage.auth.roles',
            component: AuthRoles,
            meta: {
              hidden: false,
            },
          },
        ],
      },
    ],
  },
  {
    path: '/seeting',
    name: 'global-setting',
    component: RouteView,
    meta: {
      icon: '#icon_microsoft',
      title: '全局设置',
      code: 'platform.serviceInstance;platform.zone;platform.alert;platform.applications',
      type: 'submenu',
      // hidden: false,
    },
    children: [
      {
        path: 'service',
        name: 'manage.service.list',
        component: ServiceList,
        meta: {
          icon: '#icon_stack-alt',
          title: '服务管理',
          code: 'platform.serviceInstance',
          hidden: false,
        },
      },
      {
        path: 'service/:id',
        name: 'manage.service.detail',
        component: ServiceDetail,
        meta: {
          activeMenu: 'manage.service.list',
          hidden: true,
        },
      },
      // 应用管理
      {
        path: 'application',
        name: 'manage.application',
        component: Application,
        meta: {
          title: '应用模板管理',
          icon: '#icon_service',
          code: 'platform.applications',
          hidden: false,
        },
      },
      {
        path: 'application/detail/:id',
        name: 'application.detail',
        component: ApplicationDetail,
        meta: {
          activeMenu: 'manage.application.detail',
          hidden: true,
        },
      },
      {
        path: 'application/:appid/instance/:instanceid',
        name: 'application.instance',
        component: AdminInstance,
        meta: {
          activeMenu: 'manage.application.instance',
          hidden: true,
        },
      },
      {
        path: 'zone',
        name: 'manage.zone.list',
        component: ZoneList,
        meta: {
          icon: '#icon_globe-alt',
          title: '可用区设置',
          code: 'platform.zone',
          hidden: false,
        },
      },
      {
        path: 'zone/:zone',
        name: 'manage.zone.detail',
        component: ZoneDetail,
        meta: {
          // icon: '#icon_globe-alt',
          // title: '可用区详情',
          // code: 'platform.zone',
          // activeMenu: 'manage.zone.list',
          hidden: true,
        },
      },
      {
        path: 'alarm-metrics',
        name: 'manage.alarm-metrics.list',
        component: AlarmMetricsList,
        meta: {
          icon: '#icon_bell',
          title: '告警指标',
          code: 'platform.alert',
          hidden: false,
        },
      },
    ],
  },
  // 无左侧导航栏
  {
    path: 'zone',
    redirect: {
      name: 'manage.zone.newapp',
    },
    component: NoSideContainer,
    meta: {
      hidden: true,
    },
    // ZoneNewApp
    children: [
      {
        path: 'newapp/:id',
        name: 'manage.zone.newapp',
        component: ZoneNewApp,
        meta: {
          activeMenu: 'manage.zone.list',
          hidden: true,
        },
      },
      {
        path: 'newapp/application/app',
        name: 'application.app',
        component: CreateApp,
        meta: {
          activeMenu: 'manage.application',
          hidden: true,
        },
      },
    ],
  },
  {
    path: 'setting',
    name: 'manage.preference',
    component: Preference,
    meta: {
      title: '设置',
      icon: '#icon_setting',
      code: 'platform.settings',
      type: 'menuItem',
    },
    redirect: {
      name: 'manage.preference.home',
    },
    children: [
      {
        path: 'home',
        name: 'manage.preference.home',
        component: HomeSetting,
        meta: {
          hidden: true,
          code: 'platform.settings',
          activeMenu: 'manage.preference',
        },
      },
      {
        path: 'appearance',
        name: 'manage.preference.appearance',
        component: Appearance,
        meta: {
          hidden: true,
          code: 'platform.settings',
          activeMenu: 'manage.preference',
        },
      },
      {
        path: 'sso',
        name: 'manage.preference.sso',
        component: SSO,
        meta: {
          hidden: true,
          code: 'platform.settings',
          activeMenu: 'manage.preference',
        },
      },
      {
        path: 'help-info-config',
        name: 'manage.preference.help-info-config',
        component: HelpInfoConfig,
        meta: {
          hidden: true,
          code: 'platform.settings',
          activeMenu: 'manage.preference',
        },
      },
    ],
  },

  // deploy
  {
    path: 'deploy',
    name: 'manage.deploy',
    component: DeployContainer,
    meta: {
      hidden: true,
    },
    children: [
      {
        path: 'zone',
        name: 'deploy.zone',
        component: DeployZone,
      },
    ],
  },

  {
    path: 'quota-field',
    name: 'manage.quota.list',
    component: QuotaField,
    meta: {
      hidden: true,
    },
  },
  {
    path: 'quota-group',
    name: 'manage.quota.group',
    component: OrgQuotaGroup,
    meta: {
      hidden: true,
    },
  },
  {
    path: 'quota-group/org',
    name: 'manage.quota.org-group',
    component: SpaceQuotaGroup,
    meta: {
      hidden: true,
    },
  },
  {
    path: 'quota-group/:org',
    name: 'manage.quota.space-group-detail',
    component: SpaceQuotaGroupDetail,
    meta: {
      hidden: true,
    },
  },

  {
    path: 'broker-service/:service',
    name: 'manage.broker-service.detail',
    component: BrokerServiceDetail,
    meta: {
      hidden: true,
    },
  },
];
