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
    return this.api.post('/quota/approval/organization', quota, {
      params: { organization_id: this.orgId },
    });
  }

  updateResourceQuota(orgId, quota) {
    quota.cpu = gib2byte(quota.cpu, 'CPU');
    quota.memory = gib2byte(quota.memory);
    quota.storage = gib2byte(quota.storage);
    return this.api.put(`/organizations/${orgId}/organization_quota`, quota);
  }

  getResourceQuotaApprovals(orgId, type = 'apply') {
    return this.api.get('/quota/approval/organization', {
      organization_id: orgId || this.orgId,
      type,
    });
  }

  /**
   * 项目组管理员可见的所有应用列表
   */
  getSpaceAllAppList(org_id, space_id, status, zoneId, appType) {
    // console.log(typeof statusId);
    return this.api.get(`/appstore/organization/${org_id}/space/${space_id}/applications`, {
      status,
      zoneId,
      appType,
    });
  }

  /**
   * 上架应用给一个项目组
   */
  OnApplication(organization_id, space_id, app_id) {
    return this.api.patch(`/appstore/organization/${organization_id}/space/${space_id}/applications/${app_id}/available`);
  }

  /**
   * 下架应用给一个项目组
   */
  offApplication(organization_id, space_id, app_id) {
    return this.api.patch(`/appstore/organization/${organization_id}/space/${space_id}/applications/${app_id}/unavailable`);
  }
}

export default new OrgService();
