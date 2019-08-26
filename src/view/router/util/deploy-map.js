import { RESOURCE_TYPE } from '@/core/constants/resource';

export default function getDeployPath(service) {
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
    services: [{ service_type }],
  } = service;

  if (service_type === RESOURCE_TYPE.APPLICATION) {
    const {
      id: serviceId,
      services: [{ id: brokerServiceId }],
    } = service;
    return {
      name: 'deploy.app',
      query: {
        serviceId,
        brokerServiceId,
      },
    };
  }
  if (service_type === RESOURCE_TYPE.ROUTE) {
    return { name: 'deploy.router' };
  }
  if (service_type === RESOURCE_TYPE.PERSISTENT_VOLUME_CLAIM) {
    return {
      name: 'deploy.volume',
      ...getParams(service),
    };
  }
  if (service_type === RESOURCE_TYPE.CONFIG_MAP) {
    return {
      name: 'deploy.config-map',
    };
  }
  if (service_type === RESOURCE_TYPE.SECRET) {
    return {
      name: 'deploy.secret',
    };
  }

  return {
    name: 'product.checkout',
    ...getParams(service),
  };
}
