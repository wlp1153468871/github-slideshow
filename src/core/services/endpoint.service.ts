import API, { APIService } from './api';
import store from '@/core/store';

class EndpointService {
  api: APIService;

  constructor() {
    this.api = API;
  }

  get space(): string {
    return store.getters.spaceId;
  }

  get zone(): string {
    return store.state.zone.id;
  }

  getEndpointsByService(
    {
      name,
      space = this.space,
      zone = this.zone,
    }: {
      name: string;
      space?: string;
      zone?: string;
    } = {
      name: '',
    },
  ) {
    return this.api.get(`/spaces/${space}/service/${name}/endpoint`, { zone });
  }
}

export default new EndpointService();
