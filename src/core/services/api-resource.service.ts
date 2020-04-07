import { APIService } from './api/index';
import api from './api';
import resources from './resources';

class APIResourceService {
  api: APIService;

  constructor() {
    this.api = api;
  }

  list(zone: any, spaceId: any) {
    return this.api.get(
      `/api_resources`,
      { zone: zone.id },
      {
        headers: {
          spaceId,
        },
      },
    );
  }
}

export default new APIResourceService();
