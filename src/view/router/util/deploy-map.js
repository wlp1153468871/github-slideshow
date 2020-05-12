import { RESOURCE_TYPE } from '@/core/constants/resource';
import Resource from '@/view/components/resource/resource-link/resource';

export default function getDeployPath(service) {
  const getParams = ({ id: serviceId, services: [{ id: brokerServiceId }] }) => {
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
      name: 'deploy.applications',
      query: {
        serviceId,
        brokerServiceId,
      },
    };
  }

  if (service_type === RESOURCE_TYPE.BROKER_SERVICE) {
    return {
      name: 'product.checkout',
      ...getParams(service),
    };
  }

  return new Resource(service_type).deployRoute;
}
