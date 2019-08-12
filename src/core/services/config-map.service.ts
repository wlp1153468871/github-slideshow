import API, { APIService } from './api';

class ConfigMapService {
  api: APIService;

  constructor() {
    this.api = API;
  }

  async listConfigMap(spaceId: string, zone: string) {
    return this.api.get(`/spaces/${spaceId}/configmaps`, { zone });
  }

  async getConfigMap(spaceId: string, zone: string, name: string) {
    return this.api.get(`/spaces/${spaceId}/configmaps/${name}`, { zone });
  }

  async createConfigMap(spaceId: string, zone: string, configMap: any) {
    return this.api.post(`/spaces/${spaceId}/configmaps`, configMap, {
      params: { zone },
    });
  }

  async updateConfigMap(spaceId: string, zone: string, name: string, configMap: any) {
    return this.api.put(`/spaces/${spaceId}/configmaps/${name}`, configMap, {
      params: { zone },
    });
  }

  async deleteConfigMap(spaceId: string, zone: string, name: string) {
    return this.api.delete(`/spaces/${spaceId}/configmaps/${name}`, { zone });
  }
}

export default new ConfigMapService();
