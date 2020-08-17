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
   * 删除某个实例
   * @param {String} zone_id
   * @param {String} spaceId 租户ID
   * @param {String} app_id 应用ID
   * @param {String} instance_id 实例ID
   */
  async deleteInstance(zone_id, space_id, app_id, instance_id) {
    return this.api.delete(`/zones/${zone_id}/spaces/${space_id}/appstore/applications/${app_id}/instances/${instance_id}`);
  }

  /**
   * 获取应用的一个实例
   * @param {String} zone_id
   * @param {String} spaceId 租户ID
   * @param {String} app_id 应用ID
   * @param {String} instance_id 实例ID
   */
  async getInstanceOne(zone_id, space_id, app_id, instance_id) {
    return this.api.get(`/zones/${zone_id}/spaces/${space_id}/appstore/applications/${app_id}/instances/${instance_id}`);
  }

  /**
   * 获取应用实例原始yaml
   * @param {String} zone_id
   * @param {String} spaceId 租户ID
   * @param {String} app_id 应用ID
   * @param {String} chart_name chart名
   * @param {String} version chart版本
   */
  async getYaml(zone_id, space_id, app_id, chart_name, version) {
    return this.api.get(`/zones/${zone_id}/spaces/${space_id}/appstore/applications/${app_id}/${chart_name}/${version}/instances/yaml`);
  }

  /**
   * 获取最新实例的配置yaml
   * @param {String} zone_id
   * @param {String} spaceId 租户ID
   * @param {String} app_id 应用ID
   * @param {String} instance_id 实例名
   */
  async getNewYaml(zone_id, space_id, app_id, instance_id) {
    return this.api.get(`/zones/${zone_id}/spaces/${space_id}/appstore/applications/${app_id}/instances/${instance_id}/yaml`);
  }

  /**
   * 以yaml创建应用实例
   * @param {String} zone_id
   * @param {String} spaceId 租户ID
   * @param {String} app_id 应用ID
   * @param {String} chart_name chart名
   * @param {String} version chart版本
   * @param {String} instance_name 实例名
   */
  async createYmal(zone_id, space_id, app_id, chart_name, version, instance_name, data) {
    return this.api.post(`/zones/${zone_id}/spaces/${space_id}/appstore/applications/${app_id}/${chart_name}/${version}/instances/${instance_name}/yaml`, data);
  }

  /**
   * 更新实例的yaml
   * @param {String} zone_id
   * @param {String} spaceId 租户ID
   * @param {String} app_id 应用ID
   * @param {String} instance_id 实例ID
   */
  async updateYaml(zone_id, space_id, app_id, instance_id, data) {
    return this.api.put(`/zones/${zone_id}/spaces/${space_id}/appstore/applications/${app_id}/instances/${instance_id}/yaml`, data);
  }

  /**
   * 获取实例的操作记录
   * @param {String} zone_id
   * @param {String} spaceId 租户ID
   * @param {String} app_id 应用ID
   * @param {String} instance_id 实例ID
   */
  async getOperator(zone_id, space_id, app_id, instance_id) {
    return this.api.get(`/zones/${zone_id}/spaces/${space_id}/appstore/applications/${app_id}/instances/${instance_id}/ops_log`);
  }
}

export default new AppStoreService();
