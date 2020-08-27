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
  getZone() {
    return this.api.get('/appstore/zones');
  }
}

export default new ServiceAdmin();
