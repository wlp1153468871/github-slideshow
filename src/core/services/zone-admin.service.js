import api from './api';

class ZoneAdmin {
  constructor() {
    this.api = api;
  }
  /**
   * @param {String} space_id 租户id
   */
  getzoneList(space_id) {
    return this.api.get(`/spaces/${space_id}/zones`);
  }
}

export default new ZoneAdmin();
