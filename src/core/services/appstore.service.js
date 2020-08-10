import api from './api';

class AppStoreService {
  constructor() {
    this.api = api;
  }

  /**
   * 所有的apps
   */
  list() {
    return this.api.get('/appstore/applications');
  }

  /**
   * 项目组已上架应用列表
   * @param {String} zone_id
   * @param {String} spaceId 租户ID
   */
  zoneList(zone_id, space_id) {
    return this.api.get(`/zones/${zone_id}/spaces/${space_id}/appstore/applications`);
  }

  /**
   * 创建新应用
   * @param {String} zone_id
   * @param {String} spaceId 租户ID
   * @param {Array} data
   */
  create(zone_id, space_id, data) {
    return this.api.post(`/zones/${zone_id}/spaces/${space_id}/appstore/applications`, data);
  }

  /**
   * 上传图片
   * @param {String} data 图片数据
   */
  uploadImg(data) {
    return this.api.post('/blobs', data);
  }

  /**
   * 上传chart文件
   * @param {String} zone_id
   * @param {String} spaceId 租户ID
   * @param {Array} data
   */
  uploadFile(zone_id, space_id, app_id, data) {
    return this.api.post(`/zones/${zone_id}/spaces/${space_id}/appstore/applications/${app_id}/application_infos`, data);
  }

  /**
   * 获取应用分类列表
   * @param {String} zone_id
   * @param {String} spaceId 租户ID
   */
  getCategory(zone_id, space_id) {
    return this.api.get(`/zones/${zone_id}/spaces/${space_id}/appstore/applications/categories`);
  }
  /**
   * 获取应用分类列表
   * @param {String} zone_id
   * @param {String} spaceId 租户ID
   * @param {String} app_id 应用ID
   */
  deleteApp(zone_id, space_id, app_id) {
    return this.api.post(`/zones/${zone_id}/spaces/${space_id}/appstore/applications/${app_id}`);
  }
}

export default new AppStoreService();
