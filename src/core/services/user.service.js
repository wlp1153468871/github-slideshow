import store from '@/core/store';
import api from './api';

class UserService {
  constructor() {
    this.api = api;
  }

  get spaceId() {
    return store.getters.spaceId;
  }

  get zoneId() {
    return store.getters.zoneId;
  }

  createUser(user) {
    return this.api.post('/users', user);
  }

  updateUser(userId, user) {
    return this.api.patch(`/users/${userId}`, user);
  }

  /**
   * 根据关键词获取用户列表
   * @param {String} q 搜索关键词
   */
  getUsers(q) {
    let params;
    if (q || q === '') {
      params = { q };
    }
    return this.api.get('/users', params);
  }

  updateSelfPwd(userId, oldPwd, newPwd) {
    return this.api.post(`/users/${userId}`, {
      old_password: oldPwd,
      new_password: newPwd,
    });
  }

  updateSelf(userId, user) {
    return this.api.patch('/user/info', user);
  }

  getSpaceUsers(spaceId) {
    return this.api.get(`/spaces/${spaceId}/users`);
  }

  updateSpaceUser(spaceId, model) {
    return this.api.patch(`/spaces/${spaceId}/users/${model.user_id}`, model);
  }

  getOrgUsers(orgId) {
    return this.api.get(`/organizations/${orgId}/users`);
  }

  updateOrgUser(orgId, userId, user) {
    return this.api.patch(`/organizations/${orgId}/users/${userId}`, user);
  }

  addOrgUser(orgId, userId, user) {
    return this.updateOrgUser(orgId, userId, user);
  }

  removeOrgUser(orgId, userId) {
    return this.api.delete(`/organizations/${orgId}/users/${userId}`);
  }

  listKeys() {
    return this.api.get('/user/apikeys');
  }

  createKey(name) {
    return this.api.post('/user/apikeys', { name });
  }
}

export default new UserService();
