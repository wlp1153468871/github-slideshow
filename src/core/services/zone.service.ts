import store from '@/core/store';
import StorageCache from './storage.cache';
import { APIService } from './api';
import api from './api';

class ZoneService {
  api: APIService;

  constructor() {
    this.api = api;
  }

  get orgId(): string {
    return store.getters.orgId;
  }

  get(zoneId: string): any {
    return this.api.get(`/zones/${zoneId}`);
  }

  /**
   * get zone from localstorage
   */
  getLocalZone() {
    return StorageCache.getZone();
  }

  /**
   * save zone to localstorage
   * @param {Zone} zone zone instance
   */
  setLocalZone(zone: any) {
    StorageCache.saveZone(zone);
  }

  getZones() {
    return this.api.get('/zones');
  }

  // get available zones
  getAvailableZones() {
    return this.getZones().then(zones => {
      // @ts-ignore
      return zones.filter(x => x.available);
    });
  }

  /**
   * update zones
   * @param zone
   * @param zoneId
   */
  updateZone(zoneId: string, zone: any) {
    return this.api.patch(`/zones/${zoneId}`, zone);
  }

  /**
   * create zones;
   * @param zone
   */
  createZone(zone: any) {
    return this.api.post('/zones', zone);
  }

  /**
   * add zone into org.
   * @param orgId
   * @param {Array<String>}zoneIds
   */
  addOrgZone(orgId: string, zoneIds: any) {
    return this.api.post(`/organizations/${orgId}/zones`, zoneIds);
  }

  /**
   * get org zones
   * @param orgId
   */
  getOrgZones(orgId = this.orgId) {
    return this.api.get(`/organizations/${orgId}/zones`);
  }

  // 删除平台可用区
  deleteZone(zoneId: string) {
    return this.api.delete(`/zones/${zoneId}`);
  }

  // 测试集群地址
  testClustersUrl(cluster: any) {
    return this.api.post('/zone/check', cluster).then(res => {
      // 三种状态 'True', 'False', 'Unknow'
      // @ts-ignore
      return res.status.status === 'True'
        ? Promise.resolve()
        : Promise.reject(res);
    });
  }
}

export default new ZoneService();
