import { APIService } from './api/index';
import api from './api';

class ServiceService {
  api: APIService;

  constructor() {
    this.api = api;
  }

  getServices(page: number, pageSize: number, q?: string) {
    return this.api.get('/superservices', {page: page || 1, pageSize: pageSize || 10, q });
  }

  getService(id: string) {
    return this.api.get(`/superservices/${id}`);
  }

  // TODO: change query api
  getAvailableServices(type: boolean) {
    // @ts-ignore
    return this.getServices(1, -1, '').then(list => list.data.filter(x => x.available === 'available') );
  }

  updateService(id: string, zoneId: string, service: any) {
    return this.api.patch(`/superservices/${id}`, service, {
      params: { zoneId },
    });
  }

  removeService(id: string) {
    return this.api.delete(`/superservices/${id}`);
  }

  getExternalParams(serviceId: string, planId: string, spaceId: string) {
    return this.api.get(`/services/${serviceId}/plans/${planId}/parameters`, {
      space_id: spaceId,
    });
  }

  getServiceParameters(serviceId: string, spaceId: string, data: any, zoneId?: string) {
    const params: { [key: string]: string } = {};
    if (spaceId) params.space_id = spaceId;
    if (zoneId) params.zone_id = zoneId;
    return this.api.post(`/services/${serviceId}/parameters`, data, {
      params,
    });
  }
}

export default new ServiceService();
