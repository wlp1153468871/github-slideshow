// TODO : 待完善
import { RESOURCE, RESOURCE_TYPE } from '@/core/constants/resource';

const dict = {
  name: '名称',
  hostname: '访问域名',
  targetPort: '目标端口',
  [RESOURCE_TYPE.APPLICATION]: '应用',
  [RESOURCE_TYPE.BROKER_SERVICE]: 'Service Broker',
  [RESOURCE_TYPE.CONFIG_MAP]: 'Config Map',
  [RESOURCE_TYPE.CONTAINER]: '容器',
  [RESOURCE_TYPE.DEPLOYMENT]: 'Deployment',
  [RESOURCE_TYPE.DEPLOYMENT_CONFIG]: 'Deployment Config',
  [RESOURCE_TYPE.POD]: 'Pod',
  [RESOURCE_TYPE.REPLICATION_CONTROLLER]: 'Replication Controller',
  [RESOURCE_TYPE.ROUTE]: 'Route',
  [RESOURCE_TYPE.SECRET]: 'Secret',
  [RESOURCE_TYPE.SERVICE]: 'Service',
  [RESOURCE_TYPE.STATEFUL_SET]: 'Stateful Set',
  [RESOURCE_TYPE.VOLUME]: 'PVC',
};

Object.entries(RESOURCE).forEach(([key, value]) => {
  dict[key.toLowerCase()] = value.name;
});

export default function translateFilter(key) {
  return dict[key] || key;
}
