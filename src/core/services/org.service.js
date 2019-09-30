import store from '@/core/store';
import { gib2byte } from '@/core/utils/gib2byte';
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

  getResourceQuota(orgId) {
    return this.api.get(`organizations/${orgId || this.orgId}/organization_quota`);
  }

  getSpaceResourceQuotas(orgId) {
    return this.api.get(`organizations/${orgId || this.orgId}/space_quota`);
  }

  applyResourceQuota(quota) {
    quota.cpu = gib2byte(quota.cpu, 'CPU');
    quota.memory = gib2byte(quota.memory);
    quota.storage = gib2byte(quota.storage);
    return this.api.post('/quota/approval/organization', quota, { params: { organization_id: this.orgId } });
  }

  updateResourceQuota(orgId, quota) {
    quota.cpu = gib2byte(quota.cpu, 'CPU');
    quota.memory = gib2byte(quota.memory);
    quota.storage = gib2byte(quota.storage);
    return this.api.put(`/organizations/${orgId}/organization_quota`, quota);
  }

  getResourceQuotaApprovals(orgId, type = 'apply') {
    return this.api.get('/quota/approval/organization', { organization_id: orgId || this.orgId, type });
  }
}

export default new OrgService();
