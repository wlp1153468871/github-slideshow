import API, { APIService } from './api';
import store from '@/core/store';

class GrafanaService {
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

  getLink({
    space = this.space,
    zone = this.zone,
  }: {
    space?: string;
    zone?: string;
  } = {}) {
    return this.api.get(`/spaces/${space}/grafana`, { zone });
  }
}

export default new GrafanaService();
