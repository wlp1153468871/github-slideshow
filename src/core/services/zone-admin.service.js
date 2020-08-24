import rule from '../../view/pages/console/resource/route/detail/panels/rule';
import store from '../store';
import api, { APIService } from './api';

class ZoneAdmin {
  // api = APIService;

  constructor() {
    this.api = api;
  }

  get zoneId() {
    return store.getters.zoneId;
  }
  /**s
   * 列出所有可用区
   * @param {String}
   */
  getzoneList() {
    return this.api.get(`/appstore/zones`);
  }

  /**
   * 获取所有分类
   */
  getCategoryList() {
    return this.api.get(`/appstore/applications/categories`);
  }

  /**
   * 列出选定可用区下所有的app
   */
  getSelectedZone(status) {
    return this.api.get(`/appstore/zones/${this.zoneId}/applications`, {
       status: status
    });
  }

  /**
   * 下架可用区app
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
  deleteApplication(id) {
    return this.api.delete(`/appstore/zone/${this.zoneId}/applications/${id}`);
  }

  /**
   * 创建新全局应用
   */
  createApplication(data) {
    return this.api.post(`/appstore/zones/${this.zoneId}/applications`, data);
  }

  /**
   * 上传chart新版本
   */
  createChart(app_id, data) {
    return this.api.post(`/appstore/zones/${this.zoneId}/applications/${app_id}/application_infos`, data);
  }

  /**
   * 可用区的chart仓库信息
   */
  getChartInformation() {
    return this.api.get(`/appstore/zones/${this.zoneId}/chart_repo`)
  }

  /**
   * 列出选定可用区下的chart列表
   */
  getChartList() {
    return this.api.get(`/appstore/zones/${this.zoneId}/chart_repo/charts`)
  }

  /**
   * 仓库里一个chart的版本列表
   */
  getChartVersionList(chart_name) {
    return this.api.get(`/appstore/zones/${this.zoneId}/chart_repo/charts/${chart_name}`)
  }

  /**
   * 删除chart版本
   */
  deleteChartVersion(name, version) {
    return this.api.delete(`/appstore/zones/${this.zoneId}/chart_repo/charts/${name}/${version}`);
  }

  /**
   * 下载对应的chart
   */
  uploadChart(chart_name, version) {
    return this.api.get(`/appstore/zones/${this.zoneId}/chart_repo/charts/${chart_name}/${version}/download`);
  }

  /**
   * 删除chart所有版本
   */
  deleteChartAll(chart_name) {
    return this.api.delete(`/appstore/zones/${this.zoneId}/chart_repo/charts/${chart_name}`);
  }
}

export default new ZoneAdmin();
