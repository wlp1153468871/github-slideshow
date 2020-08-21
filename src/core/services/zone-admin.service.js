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
   * 创建新全局应用
   */
  createApplication(zone_id, data) {
    return this.api.post(`/appstore/zones/${this.zoneId}/applications`, data)
  }
}

export default new ZoneAdmin();
