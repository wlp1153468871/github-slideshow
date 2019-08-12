/**
 * 获取service对应的route path
 * @param route
 * @param service
 */

import { RESOURCE_TYPE } from '@/core/constants/resource';

export default function getRoutePath(resource) {
  const getParams = ({
    id: serviceId,
    services: [{ id: brokerServiceId }],
  }) => {
    return {
      params: {
        serviceId,
      },
      query: {
        brokerServiceId,
      },
    };
  };

  const {
    services: [{ service_type: resourceType }],
  } = resource;

  if (resourceType === RESOURCE_TYPE.APPLICATION) {
    return {
      name: 'console.applications',
    };
  }

  if (resourceType === RESOURCE_TYPE.BROKER_SERVICE) {
    return {
      name: 'console.instances',
      ...getParams(resource),
    };
  }

  if (resourceType === RESOURCE_TYPE.CONFIG_MAP) {
    return {
      name: 'resource.config-maps',
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
      name: 'resource.deployments',
    };
  }

  if (resourceType === RESOURCE_TYPE.DEPLOYMENT_CONFIG) {
    return {
      name: 'resource.deployments',
    };
  }

  if (resourceType === RESOURCE_TYPE.POD) {
    return {
      name: 'resource.pods',
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
      name: 'resource.routes',
    };
  }

  if (resourceType === RESOURCE_TYPE.SECRET) {
    return {
      name: 'resource.secrets',
    };
  }

  if (resourceType === RESOURCE_TYPE.SERVICE) {
    return {
      name: 'resource.services',
    };
  }

  if (resourceType === RESOURCE_TYPE.STATEFUL_SET) {
    return {
      name: 'resource.stateful-sets',
    };
  }

  if (resourceType === RESOURCE_TYPE.VOLUME) {
    return {
      name: 'resource.persistent-volume-claims',
    };
  }

  return {
    name: 'dashboard',
  };
}
