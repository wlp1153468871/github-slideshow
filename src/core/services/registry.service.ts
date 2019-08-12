import { APIService } from './api/index';
import api from './api';

class RegistryService {
  api: APIService;

  constructor() {
    this.api = api;
  }

  /**
   * 获取租户对应的镜像仓库的账号密码
   * @param orgId 租户ID
   * @returns {AxiosPromise<any>}
   */
  getOrgRegistrySecret(orgId: string, spaceId: string) {
    return this.api.get(`/organizations/${orgId}/registry_secret`, { spaceId });
  }

  /**
   * 获取镜像
   * @param {string} spaceId
   * @param query
   * @returns {AxiosPromise<any>}
   */
  getImages(spaceId: string, query: any) {
    return this.api.get(`/spaces/${spaceId}/repositories`, query);
  }

  /**
   * 获取某一镜像的标签
   * @returns
   */
  getTags(spaceId: string, repoName: string, query: any) {
    return this.api.get(
      `/spaces/${spaceId}/repositories/${repoName}/tags`,
      query,
    );
  }
}

export default new RegistryService();
