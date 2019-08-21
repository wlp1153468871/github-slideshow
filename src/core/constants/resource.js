export const ACCESS_MODE = {
  READ_WRITE_ONCE: {
    key: 'ReadWriteOnce',
    label: 'RWO',
    description: '读写(独占)',
  },
  READ_WRITE_MANY: {
    key: 'ReadWriteMany',
    label: 'RWX',
    description: '读写(共享)',
  },
  READ_ONLY_MANY: {
    key: 'ReadOnlyMany',
    label: 'ROX',
    description: '只读(共享)',
  },
};

export const RESOURCE = {
  DEPLOYMENT: {
    key: 'deployment',
    name: 'deployments',
    icon: '#icon_deployment',
    logo: '#icon_deployment-logo',
    route: { name: 'resource.deployments.list' },
  },
  DEPLOYMENT_CONFIG: {
    key: 'deployment-config',
    name: 'Deployment Config',
    icon: '#icon_deployment',
    logo: '#icon_deployment-config-logo',
    route: { name: 'resource.deployments.list' },
    hidden: true,
  },
  STATEFUL_SET: {
    key: 'stateful-set',
    name: 'Stateful Set',
    icon: '#icon_statefulset',
    logo: '#icon_statefulset-logo',
    route: { name: 'resource.statefulsets.list' },
  },
  POD: {
    key: 'pod',
    name: 'Pod',
    icon: '#icon_pod',
    logo: '#icon_pod-logo',
    route: { name: 'resource.pods.list' },
  },
  SERVICE: {
    key: 'service',
    name: 'Service',
    icon: '#icon_service',
    logo: '#icon_service-logo',
    route: { name: 'resource.services.list' },
  },
  ROUTE: {
    key: 'route',
    name: 'Route',
    icon: '#icon_route',
    logo: '#icon_route-logo',
    route: { name: 'resource.routes.list' },
  },
  INGRESS: {
    key: 'ingress',
    name: 'Ingress',
    icon: '#icon_ingress',
    logo: '#icon_ingress-logo',
    route: { name: 'resource.ingresses.list' },
  },
  PERSISTENT_VOLUME_CLAIM: {
    key: 'pvc',
    name: 'PVC',
    icon: '#icon_pvc',
    logo: '#icon_pvc-logo',
    route: { name: 'resource.persistentvolumeclaims.list' },
  },
  CONFIG_MAP: {
    key: 'config-map',
    name: 'ConfigMap',
    icon: '#icon_configmap',
    logo: '#icon_configmap-logo',
    route: { name: 'resource.configmaps.list' },
  },
  SECRET: {
    key: 'secret',
    name: 'Secret',
    icon: '#icon_secret',
    logo: '#icon_secret-logo',
    route: { name: 'resource.secrets.list' },
  },
  APP: {
    key: 'application',
    name: '应用',
    icon: '#icon_application',
    logo: '#icon_application-logo',
    route: { name: 'console.applications' },
    hidden: true,
  },
};

export const mergeDefaultHelpUrls = remotehelpURLDict => {
  try {
    const dict = {};
    Object.values(RESOURCE).forEach(r => {
      dict[r.key] = {
        key: r.key,
        name: r.name,
        url: '',
      };
    });
    return { ...dict, ...remotehelpURLDict };
  } catch (error) {
    return {};
  }
};

export const API_PREFERRED_VERSIONS = {
  appliedclusterresourcequotas: {
    group: 'quota.openshift.io',
    version: 'v1',
    resource: 'appliedclusterresourcequotas',
  },
  builds: { group: 'build.openshift.io', version: 'v1', resource: 'builds' },
  'builds/clone': {
    group: 'build.openshift.io',
    version: 'v1',
    resource: 'builds/clone',
  },
  'builds/log': {
    group: 'build.openshift.io',
    version: 'v1',
    resource: 'builds/log',
  },
  'buildconfigs/instantiate': {
    group: 'build.openshift.io',
    version: 'v1',
    resource: 'buildconfigs/instantiate',
  },
  buildconfigs: {
    group: 'build.openshift.io',
    version: 'v1',
    resource: 'buildconfigs',
  },
  configmaps: { version: 'v1', resource: 'configmaps' },
  clusterroles: {
    group: 'rbac.authorization.k8s.io',
    version: 'v1',
    resource: 'clusterroles',
  },
  clusterserviceclasses: {
    group: 'servicecatalog.k8s.io',
    version: 'v1beta1',
    resource: 'clusterserviceclasses',
  },
  clusterserviceplans: {
    group: 'servicecatalog.k8s.io',
    version: 'v1beta1',
    resource: 'clusterserviceplans',
  },
  daemonsets: { group: 'apps', version: 'v1', resource: 'daemonsets' },
  deployments: { group: 'apps', version: 'v1beta1', resource: 'deployments' },
  deploymentconfigs: {
    group: 'apps.openshift.io',
    version: 'v1',
    resource: 'deploymentconfigs',
  },
  'deploymentconfigs/instantiate': {
    group: 'apps.openshift.io',
    version: 'v1',
    resource: 'deploymentconfigs/instantiate',
  },
  'deploymentconfigs/rollback': {
    group: 'apps.openshift.io',
    version: 'v1',
    resource: 'deploymentconfigs/rollback',
  },
  'deploymentconfigs/log': {
    group: 'apps.openshift.io',
    version: 'v1',
    resource: 'deploymentconfigs/log',
  },
  endpoints: { version: 'v1', resource: 'endpoints' },
  events: { version: 'v1', resource: 'events' },
  horizontalpodautoscalers: {
    group: 'autoscaling',
    version: 'v1',
    resource: 'horizontalpodautoscalers',
  },
  imagestreams: {
    group: 'image.openshift.io',
    version: 'v1',
    resource: 'imagestreams',
  },
  imagestreamtags: {
    group: 'image.openshift.io',
    version: 'v1',
    resource: 'imagestreamtags',
  },
  imagestreamimages: {
    group: 'image.openshift.io',
    version: 'v1',
    resource: 'imagestreamimages',
  },
  imagestreamimports: {
    group: 'image.openshift.io',
    version: 'v1',
    resource: 'imagestreamimports',
  },
  limitranges: { version: 'v1', resource: 'limitranges' },
  oauthaccesstokens: {
    group: 'oauth.openshift.io',
    version: 'v1',
    resource: 'oauthaccesstokens',
  },
  pods: { version: 'v1', resource: 'pods' },
  'pods/log': { version: 'v1', resource: 'pods/log' },
  processedtemplates: {
    group: 'template.openshift.io',
    version: 'v1',
    resource: 'processedtemplates',
  },
  projects: {
    group: 'project.openshift.io',
    version: 'v1',
    resource: 'projects',
  },
  projectrequests: {
    group: 'project.openshift.io',
    version: 'v1',
    resource: 'projectrequests',
  },
  persistentvolumeclaims: { version: 'v1', resource: 'persistentvolumeclaims' },
  replicasets: { group: 'apps', version: 'v1', resource: 'replicasets' },
  replicationcontrollers: { version: 'v1', resource: 'replicationcontrollers' },
  resourcequotas: { version: 'v1', resource: 'resourcequotas' },
  rolebindings: {
    group: 'rbac.authorization.k8s.io',
    version: 'v1',
    resource: 'rolebindings',
  },
  roles: {
    group: 'rbac.authorization.k8s.io',
    version: 'v1',
    resource: 'roles',
  },
  routes: { group: 'route.openshift.io', version: 'v1', resource: 'routes' },
  secrets: { version: 'v1', resource: 'secrets' },
  selfsubjectrulesreviews: {
    group: 'authorization.openshift.io',
    version: 'v1',
    resource: 'selfsubjectrulesreviews',
  },
  services: { version: 'v1', resource: 'services' },
  serviceaccounts: { version: 'v1', resource: 'serviceaccounts' },
  servicebindings: {
    group: 'servicecatalog.k8s.io',
    version: 'v1beta1',
    resource: 'servicebindings',
  },
  serviceinstances: {
    group: 'servicecatalog.k8s.io',
    version: 'v1beta1',
    resource: 'serviceinstances',
  },
  statefulsets: { group: 'apps', version: 'v1beta1', resource: 'statefulsets' },
  storageclasses: {
    group: 'storage.k8s.io',
    version: 'v1',
    resource: 'storageclasses',
  },
  templates: {
    group: 'template.openshift.io',
    verison: 'v1',
    resource: 'templates',
  },
  users: { group: 'user.openshift.io', version: 'v1', resource: 'users' },
};

/**
 * 规则适用于：
 * route
 */
export const DNS1123_SUBDOMAIN_VALIDATION = {
  pattern: /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/,
  maxlength: 253,
  description:
    "Name must consist of lower-case letters, numbers, '.', and '-'. It must start and end with a letter or a number.",
  chinese:
    "名称必须由小写字母、数字、' . ' 或 ' - ' 组成，且只能以数字或字母开头结尾",
};

/**
 * 校验规则适合：namespace
 */
export const DNS1123_LABEL_VALIDATION = {
  pattern: /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/,
  maxlength: 63,
  description:
    "a DNS-1123 label must consist of lower case alphanumeric characters or '-', and must start and end with an alphanumeric character.",
  chinese: "名称必须由小写字母、数字或 '-' 组成，且不能以 '-' 开头结尾",
};

export const DNS1035_LABEL_VALIDATION = {
  pattern: /^[a-z]([-a-z0-9]*[a-z0-9])?$/,
  maxlength: 63,
  description:
    "a DNS-1035 label must consist of lower case alphanumeric characters or '-', and must start and end with an alphanumeric character.",
  chinese:
    "名称必须由小写字母、数字或 '-' 组成，不能以 '-' 和数字开头, 且不能以 '-' 结尾",
};

// 这是后端定义的资源类型的Key [😭]
export const RESOURCE_TYPE = {
  APPLICATION: 'app',
  BROKER_SERVICE: '',
  CONFIG_MAP: 'config-map',
  CONTAINER: 'container',
  DEPLOYMENT: 'deployment',
  DEPLOYMENT_CONFIG: 'DC',
  POD: 'pods',
  REPLICATION_CONTROLLER: 'RC',
  ROUTE: 'router',
  SECRET: 'secret',
  SERVICE: 'services',
  STATEFUL_SET: 'statefulsets',
  VOLUME: 'volume',
};

export const DEFAULT_RESOURCE = [
  'DeploymentConfig',
  'Deployment',
  'StatefulSet',
  'Pod',
  'Service',
  'Route',
  'Ingress',
  'ConfigMap',
  'Secret',
  'PersistentVolumeClaim',
];
