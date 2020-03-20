import api, { APIService } from './api';

const ROLE_TYPE = {
  PLATFORM: 'platform', // 平台角色
  NAMESPACE: 'namespace', // 项目组角色
};

class RoleService {
  api: APIService;

  constructor() {
    this.api = api;
  }

  getRoles(params: object) {
    return this.api.get('/authorizations/roles', params);
  }

  // 获取指定用户角色列表接口
  getRolesById(params: object, userId: string) {
    return this.api.get(`/authorizations/users/${userId}/roles`, params);
  }

  // 用户设置角色
  setRole({ userId, roleId, data }: any) {
    return this.api.put(`/authorizations/users/${userId}/roles/${roleId}`, data);
  }

  // getPermission() {
  getPermission(roleId: string) {
    return this.api.get(`/authorizations/roles/${roleId}/permission`);
  }

  getUserById(roleId: string) {
    return this.api.get(`/authorizations/roles/${roleId}/users`);
  }
}

export default new RoleService();
