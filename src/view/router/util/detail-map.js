/**
 * 获取所有创建出来的 应用实例、service 实例、资源对象实例 对应的route path
 * @param route
 * @param service
 */
import { RESOURCE_TYPE } from '@/core/constants/resource';

export default function getDetailPath(instance) {
  const {
    id: instanceId,
    name,
    superservice_id: serviceId,
    service: { service_type: resourceType, id: brokerServiceId },
  } = instance;

  if (resourceType === RESOURCE_TYPE.APPLICATION) {
    return {
      name: 'console.application',
      params: { instanceId },
    };
  }

  if (resourceType === RESOURCE_TYPE.BROKER_SERVICE) {
    return {
      name: 'console.instance',
      params: {
        serviceId,
        instanceId,
      },
      query: {
        brokerServiceId,
      },
    };
  }

  if (resourceType === RESOURCE_TYPE.CONFIG_MAP) {
    return {
      name: 'resource.config-map',
      params: { name },
    };
  }

  // TODO: container not ready
  if (resourceType === RESOURCE_TYPE.CONTAINER) {
    return {
      name: 'console.dashboard',
    };
  }

  if (resourceType === RESOURCE_TYPE.DEPLOYMENT) {
    return {
      name: 'resource.deployment',
      params: { name },
    };
  }

  if (resourceType === RESOURCE_TYPE.DEPLOYMENT_CONFIG) {
    return {
      name: 'resource.deployment-config',
      params: { name },
    };
  }

  if (resourceType === RESOURCE_TYPE.POD) {
    return {
      name: 'resource.pod',
      params: { name },
    };
  }

  // TODO: RC not ready
  if (resourceType === RESOURCE_TYPE.REPLICATION_CONTROLLER) {
    return {
      name: 'console.dashboard',
    };
  }

  if (resourceType === RESOURCE_TYPE.ROUTE) {
    return {
      name: 'resource.route',
      params: { name },
    };
  }

  if (resourceType === RESOURCE_TYPE.SECRET) {
    return {
      name: 'resource.secret',
      params: { name },
    };
  }

  if (resourceType === RESOURCE_TYPE.SERVICE) {
    return {
      name: 'resource.service',
      params: { name },
    };
  }

  if (resourceType === RESOURCE_TYPE.STATEFUL_SET) {
    return {
      name: 'resource.stateful-set',
      params: { name },
    };
  }

  if (resourceType === RESOURCE_TYPE.VOLUME) {
    return {
      name: 'resource.persistent-volume-claim',
      params: { name },
    };
  }

  return {
    name: 'console.dashboard',
  };
}
