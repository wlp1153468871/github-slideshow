import store from '@/core/store';
import { gib2byte } from '@/core/utils/gib2byte';

import api from './api';
import StorageCache from './storage.cache';

class SpaceService {
  constructor() {
    this.api = api;
  }

  get spaceId() {
    return store.getters.spaceId;
  }

  get zoneId() {
    return store.getters.zoneId;
  }

  getLocalSpace() {
    return StorageCache.getSpace();
  }

  setLocalSpace(space) {
    return StorageCache.setSpace(space);
  }

  createSpace(space) {
    return this.api.post('/spaces', space);
  }

  createSpaceZone(spaceId, space) {
    return this.api.post(`spaces/${spaceId}/zones`, space);
  }

  getSpaceZones(spaceId) {
    return this.api.get(`spaces/${spaceId}/zones`);
  }

  getSpace(spaceId) {
    return this.api.get(`/spaces/${spaceId}`);
  }

  deleteSpace(spaceId) {
    return this.api.delete(`/spaces/${spaceId}`);
  }

  updateSpace(spaceId, space) {
    return this.api.patch(`/spaces/${spaceId}`, space);
  }

  getMembers(spaceId = this.spaceId) {
    return this.api.get(`/spaces/${spaceId}/users`);
  }

  getOrgSpaces(orgId) {
    return this.api.get(`/organizations/${orgId}/spaces`);
  }

  getUserSpaces(serviceId) {
    const params = {};
    if (serviceId) params.service = serviceId;
    return this.api.get('/user/spaces', params);
  }

  listSpaceServices(spaceId = this.spaceId) {
    return this.api.get(`/spaces/${spaceId}/superservices`);
  }

  listBrokerServices(spaceId = this.spaceId, query) {
    return this.api.get(`/spaces/${spaceId}/services`, query);
  }

  globalSearch(key, zoneId, spaceId = this.spaceId) {
    key = key.trim();
    return this.api.get(`/zones/${zoneId}/search`, {
      space_id: spaceId,
      key,
    });
  }

  removeUserFromSpace(spaceId, userId) {
    return this.api.delete(`/spaces/${spaceId}/users/${userId}`);
  }

  authorizeZone(spaceId, userId, params) {
    return this.api.patch(`/spaces/${spaceId}/zones/users/${userId}`, params);
  }

  getInstances(serviceId) {
    return this.api.get(`/spaces/${this.spaceId}/services/${serviceId}/instances`, {
      zoneId: this.zoneId,
    });
  }

  deleteSpaceService(spaceId, serviceId) {
    return this.api.delete(`/spaces/${spaceId}/services/${serviceId}`);
  }

  addSpaceService(spaceId, serviceId) {
    return this.api.put(`/spaces/${spaceId}/services/${serviceId}`);
  }

  getResourceQuota(spaceId) {
    return this.api.get(`spaces/${spaceId || this.spaceId}/space_quota`);
  }

  getServiceMonitor(service_name, spaceId, zone, type, from = '', to = '', refresh = '30s') {
    return this.api.get(`spaces/${spaceId}/monitoring/service/${service_name}/type/${type}`, {
      zone,
      from,
      to,
      refresh,
    });
  }

  applyResourceQuota(quota) {
    quota.cpu = gib2byte(quota.cpu, 'CPU');
    quota.memory = gib2byte(quota.memory);
    quota.storage = gib2byte(quota.storage);
    return this.api.post('/quota/approval/space', quota, { params: { space_id: this.spaceId } });
  }

  updateResourceQuota(spaceId, quota) {
    quota.cpu = gib2byte(quota.cpu, 'CPU');
    quota.memory = gib2byte(quota.memory);
    quota.storage = gib2byte(quota.storage);
    return this.api.put(`/spaces/${spaceId || this.spaceId}/space_quota`, quota);
  }

  getResourceQuotaApprovals(type = 'apply') {
    return this.api.get('/quota/approval/space', { space_id: this.spaceId, type });
  }

  // 根据scope的id，获取其所有users和与user拥有的roles。
  getScopeUsers(spaceId) {
    return this.api.get(`/spaces/${spaceId}/users`);
  }
}

export default new SpaceService();
