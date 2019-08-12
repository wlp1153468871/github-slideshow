import { APIService } from './api/index';
import api from './api';

class BrokerService {
  api: APIService;

  constructor() {
    this.api = api;
  }

  getPlan(serviceId: string, data = {}) {
    return this.api.post(`/services/${serviceId}/plans_parameters`, data);
  }
}

export default new BrokerService();
