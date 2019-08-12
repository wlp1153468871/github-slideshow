/**
 * 获取service对应的route path
 * @param route
 * @param service
 */
import {
  APPLICATION_SERVICE,
  CONFIG_MAP,
  DEPLOYMENT_SERVICE,
  VOLUME_SERVICE,
  SECRET,
} from '@/core/constants/constants';

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

  if (service_type === APPLICATION_SERVICE) {
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
  if (service_type === DEPLOYMENT_SERVICE) {
    return { name: 'deploy.router' };
  }
  if (service_type === VOLUME_SERVICE) {
    return {
      name: 'deploy.volume',
      ...getParams(service),
    };
  }
  if (service_type === CONFIG_MAP) {
    return {
      name: 'deploy.config-map',
    };
  }
  if (service_type === SECRET) {
    return {
      name: 'deploy.secret',
    };
  }

  return {
    name: 'product.checkout',
    ...getParams(service),
  };
}
