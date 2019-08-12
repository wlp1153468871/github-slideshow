import { APIService } from './api/index';
import api from './api';

class CatalogService {
  api: APIService;

  constructor() {
    this.api = api;
  }

  /**
   * 更新首页的服务分类及对应的内容
   * @param {Object} schema same with getSchema
   */
  updateSchema(schema: any) {
    return this.api.put('/marketplace/schema', schema);
  }

  // 获取首页的服务分类及对应的内容
  getSchema() {
    return this.api.get('/marketplace/schema');
  }

  // get catalog
  getCatalog(zoneId: string): any {
    return this.api.get(`/zones/${zoneId}`);
  }

  syncCatalog(zoneId: string) {
    return this.api.post(`/zones/${zoneId}/broker_service`);
  }

  getCatalogLogs(zoneId: string) {
    return this.api.get(`/zones/${zoneId}/broker-service/sync_log`);
  }
}

export default new CatalogService();
