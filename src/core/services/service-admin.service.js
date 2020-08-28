import AuthService from '@/core/services/auth.service';
import api from './api';

class ServiceAdmin {
  constructor() {
    this.api = api;
  }

  /**
   * 列出所有的apps
   */
  getAllApp(zoneId, status, type) {
    return this.api.get('/appstore/applications', {
      zoneId,
      status,
      type,
    });
  }

  /**
   * 列出所有的可用区
   */
  async getZone() {
    return this.api.get('/appstore/zones');
  }

  /**
   * 根据app_id获取一个应用
   * @param {String} app_id
   */
  async getApp(app_id) {
    return this.api.get(`/appstore/applications/${app_id}`);
  }

  /**
   * 获取charts（版本）列表
   * @param {String} app_id
   */
  async getCharts(app_id) {
    return this.api.get(`/appstore/applications/${app_id}/application_infos`);
  }

  /**
   * 获取app下已上架的项目组列表
   * @param {String} app_id
   */
  async getAvaOrganizations(app_id) {
    return this.api.get(`/appstore/applications/${app_id}/available/spaces`);
  }

  /**
   * 获取app下已下架的项目组列表
   * @param {String} app_id
   */
  async getUnavaOrganizations(app_id) {
    return this.api.get(`/appstore/applications/${app_id}/unavailable/spaces`);
  }

  /**
   * 下架应用给一个项目组
   * @param {String} space_id 项目组id
   * @param {String} app_id
   */
  async unavaOrgApp(space_id, app_id) {
    return this.api.patch(`/appstore/space/${space_id}/applications/${app_id}/unavailable`);
  }

  /**
   * 上架应用给一个项目组
   * @param {String} space_id 项目组id
   * @param {String} app_id
   */
  async avaOrgApp(space_id, app_id) {
    return this.api.patch(`/appstore/space/${space_id}/applications/${app_id}/available`);
  }

  /**
   * 获取应用下的实例列表
   * @param {String} app_id
   */
  async getInstances(app_id) {
    return this.api.get(`/appstore/applications/${app_id}/instances`);
  }

  /**
   * 获取应用分类列表
   */
  async getCategory() {
    return this.api.get('/appstore/applications/categories');
  }

  /**
   * 更新应用信息
   * @param {String} app_id
   */
  async updateApp(app_id, data) {
    return this.api.patch(`/appstore/applications/${app_id}`, data);
  }
  /**
   * 上传图片
   * @param {String} data 图片数据
   */
  get token() {
    return AuthService.getToken();
  }
  uploadPic(file) {
    return this.api
      .request({
        url: '/blobs',
        method: 'post',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': file.type,
        },
        data: file,
      })
      .then(res => {
        return res;
      })
      .catch(() => {
        console.log('上传出错了');
      });
  }

  /**
   * 上传chart新版本
   * @param {String} zone_id
   * @param {Array} data
   */
  async uploadFile(zone_id, app_id, data) {
    return this.api.post(`/appstore/zones/${zone_id}/applications/${app_id}/application_infos`, data);
  }
  /**
   * 下架应用
   */
  availableOff(app_id) {
    return this.api.patch(`/appstore/applications/${app_id}/unavailable`);
  }

  /**
   * 上架应用
   */
  availableOn(app_id) {
    return this.api.patch(`/appstore/applications/${app_id}/available`);
  }

  /**
   * 删除应用/批量删除也是此接口
   */
  deleteApplication(id, zoneId) {
    return this.api.delete(`/appstore/zone/${zoneId}/applications/${id}`);
  }
}

export default new ServiceAdmin();
