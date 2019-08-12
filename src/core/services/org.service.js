import store from '@/core/store';
import api from './api';
import StorageCache from './storage.cache';

class OrgService {
  constructor() {
    this.api = api;
  }

  get orgId() {
    return store.getters.orgId;
  }

  getLocalOrg() {
    return StorageCache.getOrg();
  }

  setLocalOrg(org) {
    return StorageCache.setOrg(org);
  }

  getOrgs() {
    return this.api.get('/organizations');
  }

  getOrg(orgId) {
    return this.api.get(`/organizations/${orgId}`);
  }

  createOrg(org) {
    return this.api.post('/organizations/', org);
  }

  updateOrg(orgId, org) {
    return this.api.patch(`/organizations/${orgId}`, org);
  }

  getMembers(orgId = this.orgId) {
    return this.api.get(`/organizations/${orgId}/users`);
  }

  deleteOrg(orgId) {
    return this.api.delete(`/organizations/${orgId}`);
  }

  getOrgSpaces(orgId) {
    return this.api.get(`/organizations/${orgId}/spaces`);
  }

  createOrgSpace(orgId, space) {
    return this.api.post(`/organizations/${orgId}/spaces`, space);
  }

  getUserOrgs(serviceId) {
    const params = {};
    if (serviceId) {
      params.service = serviceId;
    }
    return this.api.get('/user/organizations', params);
  }

  addOrg(org) {
    return this.api.post('/organizations', org);
  }
}

export default new OrgService();
