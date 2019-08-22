import { APIService } from './api/index';
import api from './api';
import resources from './resources';

class APIResourceService {
  api: APIService;

  constructor() {
    this.api = api;
  }

  list(zone: any) {
    return this.api.get(`/api_resources`, { zone: zone.id });
  }
}

export default new APIResourceService();
