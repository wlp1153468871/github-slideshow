import store from '@/core/store';
import api, { APIService } from './api';

class RouteService {
  api: APIService;

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
   * 创建 Route
   * @param spaceId
   * @param zone
   * @param data
   * @returns {AxiosPromise<any>}
   */
  create(spaceId: string, zone: string, data: any) {
    return this.api.post(`/spaces/${spaceId}/routers`, data, {
      params: { zone },
    });
  }

  /**
   * 更新 Route
   * @param spaceId
   * @param zone
   * @param name
   * @param data
   * @returns {AxiosPromise<any>}
   */
  update(spaceId: string, zone: string, name: string, data: any) {
    return this.api.put(`/spaces/${spaceId}/routers/${name}`, data, {
      params: { zone },
    });
  }

  /**
   * 获取 Route 列表
   * @param spaceId
   * @param zone
   * @returns {AxiosPromise<any>}
   */
  list(spaceId: string, zone: string) {
    return this.api.get(`/spaces/${spaceId}/routers`, {
      zone,
    });
  }

  /**
   * 删除 Route
   * @param spaceId
   * @param zone
   * @param name
   * @returns {AxiosPromise}
   */
  delete(spaceId: string, zone: string, name: string) {
    return this.api.delete(`/spaces/${spaceId}/routers/${name}`, { zone });
  }

  /**
   * 获取 Route 详情
   * @param {string} spaceId
   * @param {string} zone
   * @param {string} name
   * @returns {AxiosPromise<any>}
   */
  get(spaceId: string, zone: string, name: string) {
    return this.api.get(`/spaces/${spaceId}/routers/${name}`, { zone });
  }

  updateByYaml(
    {
      name,
      data,
      space = this.space,
      zone = this.zone,
    }: {
      name: string;
      data: any;
      space?: string;
      zone?: string;
    } = { name: '', data: '' },
  ) {
    if (!name) return;
    return this.api.put(`/spaces/${space}/routers/${name}/yaml`, data, {
      params: { zone },
    });
  }
}

export default new RouteService();
