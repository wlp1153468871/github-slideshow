import { APIService } from './api/index';
import api from './api';

class BrokerService {
  api: APIService;

  constructor() {
    this.api = api;
  }

  getBrokerService(id: string) {
    return this.api.get(`/services/${id}`);
  }

  getPlans(id: string) {
    return this.api.get(`/services/${id}/plans`);
  }

  updateServicePlan(serviceId: string, planId: string, params: any) {
    return this.api.patch(`/services/${serviceId}/plans/${planId}`, params);
  }

  updateServicePlanQuota(
    serviceId: string,
    planId: string,
    quotaId: string,
    params: any,
  ) {
    return this.api.patch(
      `/services/${serviceId}/plans/${planId}/quotas/${quotaId}`,
      params,
    );
  }
}

export default new BrokerService();
