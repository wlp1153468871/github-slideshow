import store from '@/core/store';
import API, { APIService } from './api';
import { get as getValue } from 'lodash';

class ConfigMapService {
  api: APIService;

  constructor() {
    this.api = API;
  }

  get space() {
    return store.getters.spaceId;
  }

  get zone() {
    return store.state.zone.id;
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

  updateByYaml(data: any) {
    const name = getValue(data, 'metadata.name');
    if (!name) Promise.reject('缺少名称');
    return this.api.put(`/spaces/${this.space}/configmaps/${name}/yaml`, data, {
      params: { zone: this.zone },
    });
  }

  getRefs(name: string) {
    return this.api.get(`/spaces/${this.space}/configmaps/${name}/objrefs`, {
      zone: this.zone,
    });
  }
}

export default new ConfigMapService();
