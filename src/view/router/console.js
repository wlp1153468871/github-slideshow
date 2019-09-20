import store from '@/core/store';
import NProgress from 'nprogress';
import Vue from 'vue';

// container
import ConsoleContainer from '@/view/pages/console/container/container.vue';

// console
import ApprovalHistory from '@/view/pages/console/approval/approval-history/approval-history.vue';
import ApprovalList from '@/view/pages/console/approval/approval-list/approval-list.vue';
import ApprovalSetting from '@/view/pages/console/approval/approval-setting/approval-setting.vue';
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
import Monitor from '@/view/pages/console/monitor/monitor.vue';

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

export default {
  path: '/console',
  name: 'console',
  redirect: {
    name: 'console.dashboard',
  },
  component: ConsoleContainer,
  children: [
    {
      path: 'dashboard',
      name: 'console.dashboard',
      component: Dashboard,
    },
    {
      path: 'registry',
      name: 'console.registry',
      component: Registry,
    },
    {
      path: 'monitor',
      name: 'console.monitor',
      component: Monitor,
    },
    {
      path: 'instances/:serviceId',
      name: 'console.instances',
      component: InstanceList,
    },
    {
      path: 'instances/:serviceId/:instanceId',
      name: 'console.instance',
      component: InstanceDetail,
      meta: {
        activeMenu: 'console.instances',
      },
    },
    {
      path: 'applications',
      name: 'console.applications.list',
      component: AppList,
    },
    {
      path: 'applications/:instanceId',
      name: 'console.applications.detail',
      component: AppDetail,
      meta: {
        activeMenu: 'console.applications.list',
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
      path: 'resource/deployments',
      name: 'resource.deployments.list',
      component: Deployments,
    },
    {
      path: 'resource/deployments/:name',
      name: 'resource.deployments.detail',
      component: Deployment,
      meta: {
        activeMenu: 'resource.deployments.list',
      },
    },
    {
      path: 'resource/deploymentconfigs',
      name: 'resource.deploymentconfigs.list',
      component: DeploymentConfigList,
    },
    {
      path: 'resource/deploymentconfigs/:name',
      name: 'resource.deploymentconfigs.detail',
      component: DeploymentConfig,
      meta: {
        activeMenu: 'resource.deployments.list',
      },
    },
    {
      path: 'resource/statefulsets',
      name: 'resource.statefulsets.list',
      component: StatefulSetList,
    },
    {
      path: 'resource/statefulsets/:name',
      name: 'resource.statefulsets.detail',
      component: StatefulSetDetail,
      meta: {
        activeMenu: 'resource.statefulsets.list',
      },
    },
    {
      path: 'resource/pods',
      name: 'resource.pods.list',
      component: Pods,
    },
    {
      path: 'resource/pods/:name',
      name: 'resource.pods.detail',
      component: Pod,
      meta: {
        activeMenu: 'resource.pods.list',
      },
    },
    {
      path: 'resource/services',
      name: 'resource.services.list',
      component: ServiceList,
    },
    {
      path: 'resource/services/:name',
      name: 'resource.services.detail',
      component: ServiceDetail,
      meta: {
        activeMenu: 'resource.services.list',
      },
    },
    {
      path: 'resource/routes',
      name: 'resource.routes.list',
      component: RouteList,
    },
    {
      path: 'resource/routes/:name',
      name: 'resource.routes.detail',
      component: RouteDetail,
      meta: {
        activeMenu: 'resource.routes.list',
      },
    },
    {
      path: 'resource/ingresses',
      name: 'resource.ingresses.list',
      component: IngressList,
    },
    {
      path: 'resource/ingresses/:name',
      name: 'resource.ingresses.detail',
      component: IngressDetail,
      meta: {
        activeMenu: 'resource.ingresses.list',
      },
    },
    {
      path: 'resource/persistent-volume-claims',
      name: 'resource.persistentvolumeclaims.list',
      component: VolumeList,
    },
    {
      path: 'resource/persistentvolumeclaims/:name',
      name: 'resource.persistentvolumeclaims.detail',
      component: VolumeDetail,
      meta: {
        activeMenu: 'resource.persistentvolumeclaims.list',
      },
    },
    {
      path: 'resource/secrets',
      name: 'resource.secrets.list',
      component: SecretList,
    },
    {
      path: 'resource/secrets/:name',
      name: 'resource.secrets.detail',
      component: SecretDetail,
      meta: {
        activeMenu: 'resource.secrets.list',
      },
    },
    {
      path: 'resource/configmaps',
      name: 'resource.configmaps.list',
      component: ConfigMapList,
    },
    {
      path: 'resource/configmaps/:name',
      name: 'resource.configmaps.detail',
      component: ConfigMapDetail,
      meta: {
        activeMenu: 'resource.configmaps.list',
      },
    },

    {
      path: 'approval',
      name: 'console.approval.list',
      component: ApprovalList,
    },
    {
      path: 'approval/history',
      name: 'console.approval.history',
      component: ApprovalHistory,
    },
    {
      path: 'approval/setting',
      name: 'console.approval.setting',
      component: ApprovalSetting,
    },
    {
      path: 'user',
      name: 'console.user.list',
      component: UserList,
    },
    // deploy
    {
      path: 'deploy',
      name: 'deploy',
      beforeEnter(to, from, next) {
        // 每次经过 console 都会经过这个函数, 所以, 需要注意执行效率;
        // 目前的过滤条件是前端写死的, 能够集中处理呢?
        if (/deploy\./.test(to.name)) {
          const yes = Vue.prototype.$ability.can('create');
          if (yes) {
            next();
          } else {
            // can't create!
            next({ name: 'console' });
          }
        } else {
          next();
        }
      },
      component: DeployContainer,
      children: [
        {
          path: 'form/applications',
          name: 'deploy.applications',
          component: DeployApp,
        },
        {
          path: 'deploymentconfigs',
          name: 'deploy.deploymentconfigs',
          component: DeploymentConfigList,
        },
        {
          path: 'deployments',
          name: 'deploy.deployments',
          component: Deployments,
        },
        {
          path: 'statefulsets',
          name: 'deploy.statefulsets',
          component: StatefulSetList,
        },
        {
          path: 'services',
          name: 'deploy.services',
          component: ServiceList,
        },
        {
          path: 'form/routes',
          name: 'deploy.routes',
          component: DeployRoute,
        },
        {
          path: 'ingresses',
          name: 'deploy.ingresses',
          component: IngressList,
        },
        {
          path: 'form/configmaps',
          name: 'deploy.configmaps',
          component: DeployConfigMap,
        },
        {
          path: 'form/secrets',
          name: 'deploy.secrets',
          component: DeploySecret,
        },

        {
          path: 'form/persistentvolumeclaims',
          name: 'deploy.persistentvolumeclaims',
          component: DeployVolume,
        },
        {
          path: 'form/product/:serviceId',
          name: 'product.checkout',
          component: ProductCheckout,
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
      children: [
        {
          path: 'self',
          name: 'profile.self',
          component: ProfileSelf,
        },
        {
          path: 'charging',
          name: 'profile.charging',
          component: ProfileCharging,
        },
      ],
    },
    {
      path: 'quota',
      name: 'console.space-quota',
      component: SpaceQuota,
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
      children: [
        {
          path: 'space',
          name: 'org.space',
          component: SpaceList,
        },
        {
          path: 'user',
          name: 'org.user',
          component: OrgUserList,
        },
        {
          path: 'approval',
          name: 'org.quota-approval',
          component: OrgQuotaApproval,
        },
        {
          path: 'group',
          name: 'org.quota',
          component: OrgQuota,
        },
        {
          path: 'registry',
          name: 'org.registry',
          component: OrgRegistry,
        },
      ],
    },
  ],
};
