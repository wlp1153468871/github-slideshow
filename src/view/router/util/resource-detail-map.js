import { RESOURCE_TYPE } from '@/core/constants/resource';
import Resource from '@/view/components/resource/resource-link/resource';

export default function getDetailPath(instance) {
  const {
    id: instanceId,
    name,
    superservice_id: serviceId,
    service: { service_type: kind, id: brokerServiceId },
  } = instance;

  if (kind === RESOURCE_TYPE.APPLICATION) {
    return {
      name: 'console.applications.detail',
      params: { instanceId },
    };
  }

  if (kind === RESOURCE_TYPE.BROKER_SERVICE) {
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

  const resourceService = new Resource(kind, name);
  resourceService.unwatch();
  return resourceService.route;
}
