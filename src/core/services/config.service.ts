import store from '@/core/store';
import API, { APIService } from './api';

class ConfigService {
  api: APIService;

  constructor() {
    this.api = API;
  }

  get spaceId(): string {
    return store.getters.spaceId;
  }

  get zoneId(): string {
    return store.getters.zoneId;
  }

  /**
   * 创建（加密） Config Map
   */
  createConfigMap(serviceId: string, configMap: any) {
    return this.api.post(
      `/spaces/${this.spaceId}/services/${serviceId}/instances`,
      configMap,
    );
  }

  /**
   * （加密） Config Map 列表
   */
  listConfigMaps(serviceId: string) {
    return this.api.get(
      `spaces/${this.spaceId}/services/${serviceId}/instances`,
      { zoneId: this.zoneId },
    );
  }

  /**
   * 删除（加密） Config Map 列表
   */
  deleteConfigMap(instanceId: string) {
    return this.api.delete(`/instances/${instanceId}`);
  }
}

export default new ConfigService();
