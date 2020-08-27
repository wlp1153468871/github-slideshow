import api from './api';

class ServiceAdmin {
  constructor() {
    this.api = api;
  }
  /**
   * 列出所有的apps
   */
  getAllApp(zoneId, status, type) {
    return this.api.get('/appstore/applications', {
      zoneId,
      status,
      type,
    });
  }
  /**
   * 列出所有的可用区
   */
  async getZone() {
    return this.api.get('/appstore/zones');
  }
  /**
   * 根据app_id获取一个应用
   * @param {String} app_id
   */
  async getApp(app_id) {
    return this.api.get(`/appstore/applications/${app_id}`);
  }
}

export default new ServiceAdmin();
