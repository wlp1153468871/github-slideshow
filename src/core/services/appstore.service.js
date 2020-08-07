import api from './api';

class AppStoreService {
  constructor() {
    this.api = api;
  }

  // 所有的apps
  list() {
    return this.api.get('/appstore/applications');
  }

  // 项目组已上架应用列表
  zoneList(zone_id, space_id) {
    // zones/{zone_id}/spaces/{space_id}/appstore/applications
    return this.api.get(`zones/${zone_id}/spaces/${space_id}/appstore/applications`);
  }

  // 创建新应用
  create(zone_id, space_id, data) {
    return this.api.post(`/zones/${zone_id}/spaces/${space_id}/appstore/applications`, data);
  }

  //  上传图片
  uploadImg(data) {
    return this.api.post('/blobs', data);
  }

  // 上传chart文件
  uploadFile(zone_id, space_id, app_id, data) {
    // http://10.33.140.14:8001/v1/zones/{zone_id}/spaces/{space_id}/appstore/applications/{app_id}/application_infos
    return this.api.post(`zones/${zone_id}/spaces/${space_id}/appstore/applications/${app_id}/application_infos`, data);
  }
}

export default new AppStoreService();
