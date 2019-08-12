/**
 * Created by smvexf on 2019/4/25.
 */
import api from './api';

class VolumeService {
  constructor() {
    this.api = api;
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
}

export default new VolumeService();
