// import axios from 'axios';
import { APIService } from './api';
import api from './api';
import store from '@/core/store';

class DeploymentConfigService {
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

  list(spaceId: string, zone: string) {
    // return axios.get('./mock/statefulsets.json');
    return this.api.get(`spaces/${spaceId}/deploymentconfigs`, { zone });
  }

  get(spaceId: string, zone: string, name: string) {
    return this.api.get(`spaces/${spaceId}/deploymentconfigs/${name}`, { zone });
  }

  post(body: object) {
    return this.api.post(`spaces/${this.space}/deploymentconfigs`, body, {
      params: {
        zone: this.zone,
      },
    });
  }

  put(spaceId: string, zone: string, name: string, body: object) {
    return this.api.put(`spaces/${spaceId}/deploymentconfigs/${name}`, body, {
      params: {
        zone,
      },
    });
  }

  restart(spaceId: string, zone: string, name: string) {
    return this.api.put(`spaces/${spaceId}/deploymentconfigs/${name}/restart`, null, {
      params: {
        zone,
      },
    });
  }

  delete(spaceId: string, zone: string, name: string) {
    return this.api.delete(`spaces/${spaceId}/deploymentconfigs/${name}`, { zone });
  }

  getPodList(spaceId: string, zone: string, name: string) {
    return this.api.get(`spaces/${spaceId}/deploymentconfigs/${name}/pods`, { zone });
  }

  getEventList(spaceId: string, zone: string, name: string) {
    return this.api.get(`spaces/${spaceId}/deploymentconfigs/${name}/events`, { zone });
  }

  getEventsAndLatestHistoryEvents(spaceId: string, zone: string, name: string) {
    return Promise.all([
      this.getEventList(spaceId, zone, name),
      this.getLatestHistoryEvents(spaceId, zone, name),
    ]).then(([events, rcEvents]: any[]) => {
      const eventsItems = events.originData.items || [];
      const rcEventsItems = rcEvents.items || [];
      const all = eventsItems.concat(rcEventsItems);
      return all;
    });
  }

  getHistoryList(spaceId: string, zone: string, name: string) {
    return this.api.get(`spaces/${spaceId}/deploymentconfigs/${name}/replicationcontrollers`, {
      zone,
    });
  }

  getLatestHistoryEvents(spaceId: string, zone: string, name: string) {
    return this.getHistoryList(spaceId, zone, name).then<any>((res: any) => {
      try {
        const rcname = res.items[0].metadata.name;
        return this.getHistoryEvents(spaceId, zone, rcname);
      } catch (error) {
        return { items: [] };
      }
    });
  }

  getHistoryEvents(spaceId: string, zone: string, name: string) {
    return this.api.get(`/spaces/${spaceId}/replicationcontrollers/${name}/events`, {
      zone,
    });
  }

  rollbackToHistoryVersion(spaceId: string, zone: string, name: string, revision: string) {
    return this.api.put(`spaces/${spaceId}/deploymentconfigs/${name}/rollback`, null, {
      params: {
        zone,
        revision,
      },
    });
  }

  updateReplica(spaceId: string, zone: string, name: string, replicas: number) {
    return this.api.put(`spaces/${spaceId}/deploymentconfigs/${name}/scale`, null, {
      params: { zone, replicas },
    });
  }
}

export default new DeploymentConfigService();
