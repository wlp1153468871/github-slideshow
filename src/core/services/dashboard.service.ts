import { APIService } from './api/index';
import api from './api';

class DashboardService {
  api: APIService;

  constructor() {
    this.api = api;
  }

  // 获取dashboard
  getDashboard(spaceId: string) {
    return this.api.get(`/spaces/${spaceId}/services_instances`);
  }
}

export default new DashboardService();
