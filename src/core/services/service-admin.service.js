import AuthService from '@/core/services/auth.service';
import api from './api';

class ServiceAdmin {
  constructor() {
    this.api = api;
  }

  /**
   * 列出所有的apps
   */
  async getAllApp() {
    return this.api.get('/appstore/applications');
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
   * 获取app下项目组列表
   * @param {String} app_id
   */
  async getOrganizations(app_id) {
    return this.api.get(`/appstore/applications/${app_id}/spaces`);
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
   * 上传chart新版本
   * @param {String} app_id
   * @param {Array} data
   */
  async unavailableApp(app_id) {
    return this.api.patch(`/appstore/applications/${app_id}/unavailable`);
  }
}

export default new ServiceAdmin();
