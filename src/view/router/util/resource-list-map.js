import { RESOURCE_TYPE } from '@/core/constants/resource';
import Resource from '@/view/components/resource/resource-link/resource';

export default function getListPath(resource) {
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
    services: [{ service_type: kind }],
  } = resource;

  if (kind === RESOURCE_TYPE.APPLICATION) {
    return {
      name: 'console.applications.list',
    };
  }

  if (kind === RESOURCE_TYPE.BROKER_SERVICE) {
    return {
      name: 'console.instances',
      ...getParams(resource),
    };
  }

  const resourceService = new Resource(kind);
  return resourceService.route;
}
