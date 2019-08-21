import api, { APIService } from './api';
import store from '@/core/store';

class IngressService {
  api: APIService;

  constructor() {
    this.api = api;
  }

  get space(): string {
    return store.getters.spaceId;
  }

  get zone(): string {
    return store.state.zone.id;
  }

  list() {
    return this.api.get(`/spaces/${this.space}/ingresses`, { zone: this.zone });
  }

  create(data: any) {
    return this.api.post(`/spaces/${this.space}/ingresses`, data, {
      params: { zone: this.zone },
    });
  }

  get(name: string) {
    return this.api.get(`/spaces/${this.space}/ingresses/${name}`, {
      zone: this.zone,
    });
  }

  update(data: any, name: string) {
    return this.api.put(`/spaces/${this.space}/ingresses/${name}`, data, {
      params: {
        zone: this.zone,
      },
    });
  }

  delete(name: string) {
    return this.api.delete(`/spaces/${this.space}/ingresses/${name}`, {
      zone: this.zone,
    });
  }

  getPods(name: string) {
    return this.api.get(`/spaces/${this.space}/ingresses/${name}/pods`, {
      zone: this.zone,
    });
  }
}

export default new IngressService();
