import api, { APIService } from './api';
import store from '@/core/store';

class DeploymentResourceService {
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

  get(spaceId: string, zone: string, name: string) {
    return this.api.get(`/spaces/${spaceId}/deployments/${name}`, {
      zone,
    });
  }

  list(spaceId: string, zone: string) {
    return this.api.get(`/spaces/${spaceId}/deployments`, {
      zone,
    });
  }

  create(spaceId: string, zone: string, value: string) {
    return this.api.post(`/spaces/${spaceId}/deployments`, value, {
      params: {
        zone,
      },
    });
  }

  getPods(spaceId: string, zone: string, name: string) {
    return this.api.get(`/spaces/${spaceId}/deployments/${name}/pods`, {
      zone,
    });
  }

  getEvents(spaceId: string, zone: string, name: string) {
    return this.api.get(`/spaces/${spaceId}/deployments/${name}/events`, {
      zone,
    });
  }

  getEventsAndLatestHistoryEvents(spaceId: string, zone: string, name: string) {
    return Promise.all([
      this.getEvents(spaceId, zone, name),
      this.getLatestHistoryEvents(spaceId, zone, name),
    ]).then(([events, rsEvents]: any[]) => {
      const eventsItems = events.originData.items || [];
      const rsEventsItems = rsEvents.items || [];
      const all = eventsItems.concat(rsEventsItems);
      return all;
    });
  }

  getHistory(spaceId: string, zone: string, name: string) {
    return this.api.get(`/spaces/${spaceId}/deployments/${name}/replicasets`, {
      zone,
    });
  }

  getLatestHistoryEvents(spaceId: string, zone: string, name: string) {
    return this.getHistory(spaceId, zone, name).then<any>((res: any) => {
      try {
        const rsname = res.items[0].metadata.name;
        return this.getHistoryEvents(spaceId, zone, rsname);
      } catch (error) {
        return { items: [] };
      }
    });
  }

  getHistoryEvents(spaceId: string, zone: string, name: string) {
    return this.api.get(`/spaces/${spaceId}/replicaset/${name}/events`, {
      zone,
    });
  }

  getSecrets(spaceId: string, zone: string) {
    return this.api.get(`/spaces/${spaceId}/secrets`, {
      zone,
    });
  }

  getConfigMaps(spaceId: string, zone: string) {
    return this.api.get(`/spaces/${spaceId}/configmaps`, {
      zone,
    });
  }

  scale(spaceId: string, zone: string, name: string, replicas: string) {
    return this.api.put(`/spaces/${spaceId}/deployments/${name}/scale`, null, {
      params: {
        zone,
        replicas,
      },
    });
  }

  restart(spaceId: string, zone: string, name: string) {
    return this.api.put(`/spaces/${spaceId}/deployments/${name}/restart`, null, {
      params: {
        zone,
      },
    });
  }

  delete(spaceId: string, zone: string, name: string) {
    return this.api.delete(`/spaces/${spaceId}/deployments/${name}`, { zone });
  }

  updateDeployment(spaceId: string, zone: string, name: string, value: string) {
    return this.api.put(`/spaces/${spaceId}/deployments/${name}`, value, {
      params: {
        zone,
      },
    });
  }

  rollback(spaceId: string, zone: string, name: string, revision: string) {
    return this.api.post(`/spaces/${spaceId}/deployments/${name}/rollback`, null, {
      params: {
        zone,
        revision,
      },
    });
  }
}

export default new DeploymentResourceService();
