import api from './api';

class AppStoreService {
  constructor() {
    this.api = api;
  }

  /**
   * 所有的apps
   */
  async list() {
    return this.api.get('/appstore/applications');
  }

  /**
   * 项目组已上架应用列表
   * @param {String} zone_id
   * @param {String} spaceId 租户ID
   */
  async zoneList(zone_id, space_id) {
    return this.api.get(`/zones/${zone_id}/spaces/${space_id}/appstore/applications`);
  }

  /**
   * 创建新应用
   * @param {String} zone_id
   * @param {String} spaceId 租户ID
   * @param {Array} data
   */
  async create(zone_id, space_id, data) {
    return this.api.post(`/zones/${zone_id}/spaces/${space_id}/appstore/applications`, data);
  }

  /**
   * 上传图片
   * @param {String} data 图片数据
   */
  async uploadImg(data) {
    return this.api.post('/blobs', data);
  }

  /**
   * 上传chart文件
   * @param {String} zone_id
   * @param {String} spaceId 租户ID
   * @param {Array} data
   */
  async uploadFile(zone_id, space_id, app_id, data) {
    return this.api.post(`/zones/${zone_id}/spaces/${space_id}/appstore/applications/${app_id}/application_infos`, data);
  }

  /**
   * 获取应用分类列表
   * @param {String} zone_id
   * @param {String} spaceId 租户ID
   */
  async getCategory(zone_id, space_id) {
    return this.api.get(`/zones/${zone_id}/spaces/${space_id}/appstore/applications/categories`);
  }

  /**
   * 删除应用
   * @param {String} zone_id
   * @param {String} spaceId 租户ID
   * @param {String} app_id 应用ID
   */
  async deleteApp(zone_id, space_id, app_id) {
    return this.api.delete(`/zones/${zone_id}/spaces/${space_id}/appstore/applications/${app_id}`);
  }

  /**
   * 根据app_id获取一个应用
   * @param {String} zone_id
   * @param {String} spaceId 租户ID
   * @param {String} app_id 应用ID
   */
  async getApp(zone_id, space_id, app_id) {
    return this.api.get(`/zones/${zone_id}/spaces/${space_id}/appstore/applications/${app_id}`);
  }

  /**
   * 更新应用信息
   * @param {String} zone_id
   * @param {String} spaceId 租户ID
   * @param {String} app_id 应用ID
   */
  async updateApp(zone_id, space_id, app_id, data) {
    return this.api.patch(`/zones/${zone_id}/spaces/${space_id}/appstore/applications/${app_id}`, data);
  }

  /**
   * 获取应用下的实例列表
   * @param {String} zone_id
   * @param {String} spaceId 租户ID
   * @param {String} app_id 应用ID
   */
  async getInstances(zone_id, space_id, app_id) {
    return this.api.get(`/zones/${zone_id}/spaces/${space_id}/appstore/applications/${app_id}/instances`);
  }
  /**
   * 获取应用实例原始yaml
   * @param {String} zone_id
   * @param {String} spaceId 租户ID
   * @param {String} app_id 应用ID
   * @param {String} chart_name chart名字
   * @param {String} version chart版本
   */
  async getYaml(zone_id, space_id, app_id, chart_name, version) {
    return this.api.get(`/zones/${zone_id}/spaces/${space_id}/appstore/applications/${app_id}/${chart_name}/${version}/instances/yaml`);
  }
}

export default new AppStoreService();
