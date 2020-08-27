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

  /**
   * 根据app_id获取一个应用
   * @param {String} app_id
   */
  async getCharts(app_id) {
    return this.api.get(`/appstore/applications/${app_id}/application_infos`);
  }

  /**
   * 下架应用
   */
  availableOff(app_id) {
    return this.api.patch(`/appstore/applications/${app_id}/unavailable`);
  }

  /**
   * 上架应用
   */
  availableOn(app_id) {
    return this.api.patch(`/appstore/applications/${app_id}/available`);
  }

  /**
   * 删除应用/批量删除也是此接口
   */
  deleteApplication(id, zoneId) {
    return this.api.delete(`/appstore/zone/${zoneId}/applications/${id}`);
  }
}

export default new ServiceAdmin();
