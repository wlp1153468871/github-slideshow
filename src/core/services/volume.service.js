import store from '@/core/store';
import api from './api';

class VolumeService {
  constructor() {
    this.api = api;
  }

  get space() {
    return store.getters.spaceId;
  }

  get zone() {
    return store.state.zone.id;
  }

  /**
   * 创建  PVC
   * @param spaceId 项目组ID
   * @param data  PVC 参数
   * @param zone 可用区ID
   * @returns {AxiosPromise<T>}
   */
  createVolume(spaceId, data, zone) {
    return this.api.post(`/spaces/${spaceId}/volumes`, data, {
      params: { zone },
    });
  }

  list(spaceId, zone) {
    return this.api.get(`/spaces/${spaceId}/volumes`, {
      zone,
    });
  }

  getVolume(spaceId, zone, name) {
    return this.api.get(`/spaces/${spaceId}/volumes/${name}`, {
      zone,
    });
  }

  delete(spaceId, zone, name) {
    return this.api.delete(`/spaces/${spaceId}/volumes/${name}`, {
      zone,
    });
  }

  updateByYaml({
    space = this.space, zone = this.zone, name, data,
  }) {
    return this.api.put(`/spaces/${space}/volumes/${name}/yaml`, data, {
      params: { zone },
    });
  }

  getRefs(name) {
    return this.api.get(`/spaces/${this.space}/volumes/${name}/objrefs`, {
      zone: this.zone,
    });
  }
}

export default new VolumeService();
