import store from '@/core/store';
import NProgress from 'nprogress';

// container
// import ConsoleContainer from '@/view/pages/console/container/container.vue';

import RouteView from '@/view/layout/route-view';

// monitor
import Monitor from '@/view/pages/console/monitor/monitor.vue';

// alarm
import Alarm from '@/view/pages/console/alarm/list/list.vue';
import AlarmDetail from '@/view/pages/console/alarm/detail/detail.vue';
import CreateAlarmRule from '@/view/pages/console/alarm/new-add/new-add.vue';
// console
import ApprovalHistory from '@/view/pages/console/approval/approval-history/approval-history.vue';
import ApprovalList from '@/view/pages/console/approval/approval-list/approval-list.vue';
import InstanceDetail from '@/view/pages/console/instance/instance-detail/instance-detail.vue';
import InstanceList from '@/view/pages/console/instance/instance-list/instance-list.vue';
import ConfigMapList from '@/view/pages/console/resource/config-map/list/config-map-list.vue';
import ConfigMapDetail from '@/view/pages/console/resource/config-map/detail/config-map-detail.vue';
import SecretList from '@/view/pages/console/resource/secret/list/secret-list.vue';
import SecretDetail from '@/view/pages/console/resource/secret/detail/secret-detail.vue';
import UserList from '@/view/pages/console/user/user-list/user-list.vue';
import SpaceQuota from '@/view/pages/console/quota/space-quota.vue';
import AppList from '@/view/pages/console/app/list/app-list.vue';
import AppDetail from '@/view/pages/console/app/detail/app-detail.vue';

// deploy
import DeployContainer from '@/view/pages/deploy/container/container.vue';
import DeployApp from '@/view/pages/console/app/deploy/deploy.vue';
import DeployConfigMap from '@/view/pages/console/resource/config-map/deploy/deploy.vue';
import DeploySecret from '@/view/pages/console/resource/secret/deploy/deploy.vue';
import DeployVolume from '@/view/pages/console/resource/volume/deploy/volume.vue';
import DeployRoute from '@/view/pages/console/resource/route/deploy/route.vue';

// self
import ProfileContainer from '@/view/pages/profile/container/container.vue';
import ProfileSelf from '@/view/pages/profile/profile/profile.vue';
import ProfileCharging from '@/view/pages/profile/charging/charging/charging.vue';

// orgs
import OrgContainer from '@/view/pages/org/container/container.vue';
import SpaceList from '@/view/pages/org/space/space-list/space-list.vue';
import OrgUserList from '@/view/pages/org/user/user-list/user-list.vue';
import OrgQuota from '@/view/pages/org/quota/org-quota.vue';
import OrgQuotaApproval from '@/view/pages/org/quota/org-quota-approval.vue';
import OrgRegistry from '@/view/pages/org/registry/registry.vue';

// product
import ProductCheckout from '@/view/pages/console/product/checkout/checkout.vue';

import Dashboard from '@/view/pages/console/dashboard/dashboard.vue';
import Registry from '@/view/pages/console/registry/registry.vue';
import RegistryTag from '@/view/pages/console/registry/detail/registryTag.vue';

// resource
import Deployments from '@/view/pages/console/resource/deployment/list/deployments.vue';
import Deployment from '@/view/pages/console/resource/deployment/detail/deployment.vue';
import DeploymentConfigList from '@/view/pages/console/resource/deployment-config/list/deployment-config-list';
import DeploymentConfig from '@/view/pages/console/resource/deployment-config/detail/deployment-config.vue';
import StatefulSetList from '@/view/pages/console/resource/stateful-set/list/stateful-set-list.vue';
import StatefulSetDetail from '@/view/pages/console/resource/stateful-set/detail/stateful-set-detail.vue';
import Pods from '@/view/pages/console/resource/pod/list/pods.vue';
import Pod from '@/view/pages/console/resource/pod/detail/pod.vue';
import VolumeList from '@/view/pages/console/resource/volume/list/volume-list.vue';
import VolumeDetail from '@/view/pages/console/resource/volume/detail/volume-detail.vue';
import RouteList from '@/view/pages/console/resource/route/list/route-list.vue';
import RouteDetail from '@/view/pages/console/resource/route/detail/route-detail.vue';
import ServiceList from '@/view/pages/console/resource/service/list/service.vue';
import ServiceDetail from '@/view/pages/console/resource/service/detail/service.vue';
import IngressList from '@/view/pages/console/resource/ingress/list/ingress-list';
import IngressDetail from '@/view/pages/console/resource/ingress/detail/ingress-detail';

export default [
  {
    path: 'dashboard',
    name: 'console.dashboard',
    component: Dashboard,
    meta: {
      title: '总览',
      icon: '#icon_microsoft',
      code: 'overview',
    },
  },
  {
    path: 'applications',
    name: 'console.applications.list',
    component: AppList,
    meta: {
      title: '应用',
      icon: '#icon_application',
      code: 'application',
    },
  },
  /**
   * 资源对象列表的 Route 规则
   * path: "resource/[资源对象类型(复数)]"
   * name: "resource.[资源对象类型(复数)]"
   *
   * 资源对象详情的 Route 规则
   * path: "resource/${资源对象类型}/${资源对象Name}"
   * name: "resource.[资源对象类型]"
   *
   * 资源对象类型: Pod
   */
  {
    path: '/',
    name: 'resource',
    component: RouteView,
    meta: {
      title: '资源',
      icon: '#icon_resource',
      code: 'resource',
    },
    children: [
      {
        path: 'resource/deployments',
        name: 'resource.deployments.list',
        component: Deployments,
        meta: {
          title: 'Deployments',
          icon: '#icon_deployments',
          code: 'deployment',
        },
      },
      {
        path: 'resource/deployments/:name',
        name: 'resource.deployments.detail',
        component: Deployment,
        meta: {
          activeMenu: 'resource.deployments.list',
          hidden: true,
        },
      },
      {
        path: 'resource/deploymentconfigs',
        name: 'resource.deploymentconfigs.list',
        component: DeploymentConfigList,
        meta: {
          title: 'DeploymentConfig',
          hidden: true,
        },
      },
      {
        path: 'resource/deploymentconfigs/:name',
        name: 'resource.deploymentconfigs.detail',
        component: DeploymentConfig,
        meta: {
          activeMenu: 'resource.deploymentconfigs.list',
          hidden: true,
        },
      },
      {
        path: 'resource/statefulsets',
        name: 'resource.statefulsets.list',
        component: StatefulSetList,
        meta: {
          title: 'StatefulSet',
          icon: '#icon_statefulsets',
          code: 'statefulSet',
        },
      },
      {
        path: 'resource/statefulsets/:name',
        name: 'resource.statefulsets.detail',
        component: StatefulSetDetail,
        meta: {
          activeMenu: 'resource.statefulsets.list',
          hidden: true,
          code: 'statefulSet',
        },
      },
      {
        path: 'resource/pods',
        name: 'resource.pods.list',
        component: Pods,
        meta: {
          title: 'Pods',
          icon: '#icon_pods',
          code: 'pod',
        },
      },
      {
        path: 'resource/pods/:name',
        name: 'resource.pods.detail',
        component: Pod,
        meta: {
          activeMenu: 'resource.pods.list',
          hidden: true,
          code: 'pod',
        },
      },
      {
        path: 'resource/services',
        name: 'resource.services.list',
        component: ServiceList,
        meta: {
          title: 'Service',
          icon: '#icon_services',
          code: 'service',
        },
      },
      {
        path: 'resource/services/:name',
        name: 'resource.services.detail',
        component: ServiceDetail,
        meta: {
          activeMenu: 'resource.services.list',
          hidden: true,
        },
      },
      {
        path: 'resource/routes',
        name: 'resource.routes.list',
        component: RouteList,
        meta: {
          title: 'Route',
          icon: '#icon_route',
        },
      },
      {
        path: 'resource/routes/:name',
        name: 'resource.routes.detail',
        component: RouteDetail,
        meta: {
          activeMenu: 'resource.routes.list',
          hidden: true,
        },
      },
      {
        path: 'resource/ingresses',
        name: 'resource.ingresses.list',
        component: IngressList,
        meta: {
          title: 'Ingress',
          icon: '#icon_ingresses',
          code: 'ingress',
        },
      },
      {
        path: 'resource/ingresses/:name',
        name: 'resource.ingresses.detail',
        component: IngressDetail,
        meta: {
          activeMenu: 'resource.ingresses.list',
          hidden: true,
        },
      },

      {
        path: 'resource/configmaps',
        name: 'resource.configmaps.list',
        component: ConfigMapList,
        meta: {
          title: 'ConfigMap',
          icon: '#icon_configmaps',
          code: 'configMap',
        },
      },
      {
        path: 'resource/configmaps/:name',
        name: 'resource.configmaps.detail',
        component: ConfigMapDetail,
        meta: {
          activeMenu: 'resource.configmaps.list',
          hidden: true,
        },
      },
      {
        path: 'resource/secrets',
        name: 'resource.secrets.list',
        component: SecretList,
        meta: {
          title: 'Secret',
          icon: '#icon_secrets',
          code: 'secret',
        },
      },
      {
        path: 'resource/secrets/:name',
        name: 'resource.secrets.detail',
        component: SecretDetail,
        meta: {
          activeMenu: 'resource.secrets.list',
          hidden: true,
        },
      },
      {
        path: 'resource/persistent-volume-claims',
        name: 'resource.persistentvolumeclaims.list',
        component: VolumeList,
        meta: {
          title: 'PersistentVolumeClaim',
          icon: '#icon_persistentvolumeclaims',
          code: 'pvc',
        },
      },
      {
        path: 'resource/persistentvolumeclaims/:name',
        name: 'resource.persistentvolumeclaims.detail',
        component: VolumeDetail,
        meta: {
          activeMenu: 'resource.persistentvolumeclaims.list',
          hidden: true,
        },
      },
    ],
  },
  {
    path: '',
    name: '',
    component: RouteView,
    meta: {
      title: '服务',
      icon: '#icon_service-category',
      code: 'serviceCatalog',
    },
    children: [
      {
        path: 'instances/:serviceId',
        name: 'console.instances',
        component: InstanceList,
        meta: {
          hidden: true,
          code: 'serviceCatalog',
        },
      },
      {
        path: 'instances/:serviceId/:instanceId',
        name: 'console.instance',
        component: InstanceDetail,
        meta: {
          activeMenu: 'console.instances',
          hidden: true,
        },
      },
    ],
  },
  {
    path: 'registry',
    name: 'console.registry',
    component: Registry,
    meta: {
      title: '镜像',
      icon: '#icon_docker-image',
      code: 'image.center',
    },
  },
  {
    path: 'registry/:registryName/tags/:tagName',
    name: 'registry.registryTag',
    component: RegistryTag,
    meta: {
      activeMenu: 'console.registry',
      hidden: true,
    },
  },
  {
    path: 'monitor',
    name: 'console.monitor',
    component: Monitor,
    meta: {
      title: '监控',
      icon: '#icon_monitor',
      code: 'metric',
    },
  },
  {
    path: 'alarm/rules',
    name: 'console.alarm',
    component: Alarm,
    meta: {
      title: '告警',
      icon: '#icon_bell',
      code: 'alert',
    },
  },
  {
    path: 'alarm/rule/create',
    name: 'console.alarm.create',
    component: CreateAlarmRule,
    // beforeEnter(to, from, next) {
    //   if (store.getters.alarmAdminAccessed) {
    //     next();
    //     return;
    //   }
    //   next({ name: 'console.alarm' });
    // },
    meta: {
      hidden: true,
      code: 'alert.create',
    },
  },
  {
    path: 'alarm/rule/:id',
    name: 'console.alarm.rule',
    component: AlarmDetail,
    meta: {
      hidden: true,
    },
  },
  {
    path: 'applications/:instanceId',
    name: 'console.applications.detail',
    component: AppDetail,
    meta: {
      activeMenu: 'console.applications.list',
      hidden: true,
    },
  },
  {
    path: 'approval',
    name: 'approval',
    component: RouteView,
    meta: {
      title: '审批',
      icon: '#icon_audit',
      code: 'approve',
    },
    children: [
      {
        path: 'approval',
        name: 'console.approval.list',
        component: ApprovalList,
        meta: {
          title: '审批请求',
          code: 'approve.view',
          icon: '#icon_outgoing',
        },
      },
      {
        path: 'approval/history',
        name: 'console.approval.history',
        component: ApprovalHistory,
        meta: {
          title: '审批记录',
          code: 'approve.log',
          icon: '#icon_log',
        },
      },
      // {
      //   path: 'approval/setting',
      //   name: 'console.approval.setting',
      //   component: ApprovalSetting,
      //   meta: {
      //     title: '审批设置',
      //   },
      // },
    ],
  },
  {
    path: 'quota',
    name: 'console.space-quota',
    component: SpaceQuota,
    meta: {
      title: '配额',
      icon: '#icon_quota',
      code: 'quota',
    },
  },
  {
    path: 'user',
    name: 'console.user.list',
    component: UserList,
    meta: {
      title: '管理',
      icon: '#icon_user',
      code: 'project',
    },
  },
  // deploy
  {
    path: 'deploy',
    name: 'deploy',
    // beforeEnter(to, from, next) {
    //   // 每次经过 console 都会经过这个函数, 所以, 需要注意执行效率;
    //   // 目前的过滤条件是前端写死的, 能够集中处理呢?
    //   if (/deploy\./.test(to.name)) {
    //     const yes = Vue.prototype.$ability.can('create');
    //     if (yes) {
    //       next();
    //     } else {
    //       // can't create!
    //       next({ name: 'console' });
    //     }
    //   } else {
    //     next();
    //   }
    // },
    component: DeployContainer,
    meta: {
      hidden: true,
    },
    children: [
      {
        path: 'form/applications',
        name: 'deploy.applications',
        component: DeployApp,
        meta: {
          hidden: true,
        },
      },
      {
        path: 'deploymentconfigs',
        name: 'deploy.deploymentconfigs',
        component: DeploymentConfigList,
        meta: {
          hidden: true,
        },
      },
      {
        path: 'deployments',
        name: 'deploy.deployments',
        component: Deployments,
        meta: {
          hidden: true,
        },
      },
      {
        path: 'statefulsets',
        name: 'deploy.statefulsets',
        component: StatefulSetList,
        meta: {
          hidden: true,
        },
      },
      {
        path: 'services',
        name: 'deploy.services',
        component: ServiceList,
        meta: {
          hidden: true,
        },
      },
      {
        path: 'form/routes',
        name: 'deploy.routes',
        component: DeployRoute,
        meta: {
          hidden: true,
        },
      },
      {
        path: 'ingresses',
        name: 'deploy.ingresses',
        component: IngressList,
        meta: {
          hidden: true,
          code: 'configMap.create',
        },
      },
      {
        path: 'form/configmaps',
        name: 'deploy.configmaps',
        component: DeployConfigMap,
        meta: {
          hidden: true,
        },
      },
      {
        path: 'form/secrets',
        name: 'deploy.secrets',
        component: DeploySecret,
        meta: {
          hidden: true,
        },
      },
      {
        path: 'form/persistentvolumeclaims',
        name: 'deploy.persistentvolumeclaims',
        component: DeployVolume,
        meta: {
          hidden: true,
          code: 'pvc.create',
        },
      },
      {
        path: 'form/product/:serviceId',
        name: 'product.checkout',
        component: ProductCheckout,
        meta: {
          hidden: true,
        },
      },
    ],
  },
  // profile
  {
    path: 'profile',
    name: 'console.profile',
    redirect: {
      name: 'profile.self',
    },
    component: ProfileContainer,
    meta: {
      hidden: true,
    },
    children: [
      {
        path: 'self',
        name: 'profile.self',
        component: ProfileSelf,
        meta: {
          hidden: true,
        },
      },
      {
        path: 'charging',
        name: 'profile.charging',
        component: ProfileCharging,
        meta: {
          hidden: true,
        },
      },
    ],
  },
  // org
  {
    path: 'org',
    name: 'console.org',
    beforeEnter(to, from, next) {
      if (store.getters.isOrganizationAdmin) {
        next();
      } else {
        next({
          name: 'console.dashboard',
        });
        NProgress.done();
      }
    },
    redirect: {
      name: 'org.space',
    },
    component: OrgContainer,
    meta: {
      hidden: true,
    },
    children: [
      {
        path: 'space',
        name: 'org.space',
        component: SpaceList,
        meta: {
          hidden: true,
        },
      },
      {
        path: 'user',
        name: 'org.user',
        component: OrgUserList,
        meta: {
          hidden: true,
        },
      },
      {
        path: 'approval',
        name: 'org.quota-approval',
        component: OrgQuotaApproval,
        meta: {
          hidden: true,
        },
      },
      {
        path: 'group',
        name: 'org.quota',
        component: OrgQuota,
        meta: {
          hidden: true,
        },
      },
      {
        path: 'registry',
        name: 'org.registry',
        component: OrgRegistry,
        meta: {
          hidden: true,
        },
      },
    ],
  },
];
