import store from '../store';
import api from './api';

class ZoneAdmin {
  // api = APIService;

  constructor() {
    this.api = api;
  }

  get zoneId() {
    return store.getters.zoneId;
  }
  /** s
   * 列出所有可用区
   * @param {String}
   */
  getzoneList() {
    return this.api.get('/appstore/zones');
  }

  /**
   * 获取所有分类
   */
  getCategoryList() {
    return this.api.get('/appstore/applications/categories');
  }

  /**
   * 列出选定可用区下所有的app
   */
  getSelectedZone(zoneId, status) {
    return this.api.get(`/appstore/zones/${zoneId}/applications`, {
      status,
    });
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
   * 删除应用
   */
  deleteApplication(id, zoneId) {
    return this.api.delete(`/appstore/zone/${zoneId}/applications/${id}`);
  }

  /**
   * 创建新全局应用
   */
  createApplication(zoneId, data) {
    return this.api.post(`/appstore/zones/${zoneId}/applications`, data);
  }

  /**
   * 上传chart新版本
   */
  createChart(zoneId, chart) {
    return this.api.post(`/appstore/zones/${zoneId}/chart`, chart);
  }

  /**
   * 可用区的chart仓库信息
   */
  getChartInformation(id) {
    return this.api.get(`/appstore/zones/${id}/chart_repo`);
  }

  /**
   * 列出选定可用区下的chart列表
   */
  getChartList(id) {
    return this.api.get(`/appstore/zones/${id}/chart_repo/charts`);
  }

  /**
   * 仓库里一个chart的版本列表
   */
  getChartVersionList(zoneId, chart_name) {
    return this.api.get(`/appstore/zones/${zoneId}/chart_repo/charts/${chart_name}`);
  }

  /**
   * 删除chart版本
   */
  deleteChartVersion(zoneId, name, version) {
    return this.api.delete(`/appstore/zones/${zoneId}/chart_repo/charts/${name}/${version}`);
  }

  /**
   * 下载对应的chart
   */
  uploadChart(zoneId, chart_name, version) {
    return this.api.get(`/appstore/zones/${zoneId}/chart_repo/charts/${chart_name}/${version}/download`);
  }

  /**
   * 删除chart所有版本
   */
  deleteChartAll(zoneId, chart_name) {
    return this.api.delete(`/appstore/zones/${zoneId}/chart_repo/charts/${chart_name}`);
  }

  /**
   * 新增分类接口
   */
  addCategory(category_name) {
    return this.api.post(`/appstore/applications/categories/${category_name}`);
  }
}

export default new ZoneAdmin();
