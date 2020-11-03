import { APIService } from './api/index';
import api from './api';

class BrokerService {
  api: APIService;

  constructor() {
    this.api = api;
  }

  getPlan(serviceId: string, spaceId: string, data = {}) {
    return this.api.post(`/services/${serviceId}/plans_parameters?space_id=${spaceId}`, data);
  }
}

export default new BrokerService();
