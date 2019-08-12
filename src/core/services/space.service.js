import store from '@/core/store';
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
    return this.api.get(
      `/spaces/${this.spaceId}/services/${serviceId}/instances`,
      { zoneId: this.zoneId },
    );
  }

  deleteSpaceService(spaceId, serviceId) {
    return this.api.delete(`/spaces/${spaceId}/services/${serviceId}`);
  }

  addSpaceService(spaceId, serviceId) {
    return this.api.put(`/spaces/${spaceId}/services/${serviceId}`);
  }
}

export default new SpaceService();
