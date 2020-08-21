import api from './api';

class ServiceAdmin {
  constructor() {
    this.api = api;
  }
  /**
   * 列出所有的apps
   */
  getAllApp() {
    return this.api.get('/appstore/applications');
  }
}

export default new ServiceAdmin();
