import store from '@/core/store';
import api from './api';

class ResourceQuotaService {
  constructor() {
    this.api = api;
  }

  get zoneId() {
    return store.getters.zoneId;
  }

  get spaceId() {
    return store.getters.spaceId;
  }

  updateStatus(approvalId, reply = '', status) {
    return this.api.put(`/quota/approval/${approvalId}`, {
      reply, status,
    });
  }
}

export default new ResourceQuotaService();
