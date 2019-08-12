// import axios from 'axios';
import { APIService } from './api';
import api from './api';

class StatefulSetService {
  api: APIService;

  constructor() {
    this.api = api;
  }

  list(spaceId: string, zone: string) {
    // return axios.get('./mock/statefulsets.json');
    return this.api.get(`spaces/${spaceId}/statefulsets`, { zone });
  }

  post(spaceId: string, zone: string, body: object) {
    return this.api.post(`spaces/${spaceId}/statefulsets`, body, {
      params: {
        zone,
      },
    });
  }

  get(spaceId: string, zone: string, name: string) {
    return this.api.get(`spaces/${spaceId}/statefulsets/${name}`, { zone });
  }

  put(spaceId: string, zone: string, name: string, body: object) {
    return this.api.put(`spaces/${spaceId}/statefulsets/${name}`, body, {
      params: {
        zone,
      },
    });
  }

  delete(spaceId: string, zone: string, name: string) {
    return this.api.delete(`spaces/${spaceId}/statefulsets/${name}`, { zone });
  }

  getEventList(spaceId: string, zone: string, name: string) {
    return this.api.get(`spaces/${spaceId}/statefulsets/${name}/events`, { zone });
  }

  getPodList(spaceId: string, zone: string, name: string) {
    return this.api.get(`spaces/${spaceId}/statefulsets/${name}/pods`, { zone });
  }

  updateReplica(spaceId: string, zone: string, name: string, replicas: number) {
    return this.api.put(`spaces/${spaceId}/statefulsets/${name}/scale`, null, {
      params: { zone, replicas },
    });
  }
}

export default new StatefulSetService();
