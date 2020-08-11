import store from '@/core/store';
import { gib2byte } from '@/core/utils/gib2byte';
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

  get spaceId() {
    return store.getters.spaceId;
  }

  get zoneId() {
    return store.getters.zoneId;
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

  getZones(organizationId?: string) {
    const params = {};
    if (organizationId) {
      Object.assign(params, { organization_id: organizationId });
    }
    return this.api.get('/zones', params);
  }
  /**
   * 根据关键词获取zone列表
   * @param {Number} page 分页指定页数
   * @param {Number} pageSize 待获取数据量
   * @param {String} q 搜索关键词
   */
  getZonesByList(page: number, pageSize: number, q?: string) {
     return this.api.get('/zones', {page: page || 1, pageSize: pageSize || 10, q });
  }
  // get available zones
  getAvailableZones(organizationId?: string) {
    return this.getZones(organizationId).then(zones => {
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

  // 测试集群地址
  testClustersUrl(cluster: any) {
    return this.api.post('/zone/check', cluster).then(res => {
      // 三种状态 'True', 'False', 'Unknow'
      // @ts-ignore
      return res.status.status === 'True' ? Promise.resolve() : Promise.reject(res);
    });
  }

  updateResourceQuota(quota: any) {
    return this.getResourceQuota().then((res: any) => {
      res.spec.hard = {
        'limits.cpu': gib2byte(quota.cpu, 'CPU'),
        'limits.memory': gib2byte(quota.memory),
        'requests.storage': gib2byte(quota.storage),
      };
      return this.api.put(`spaces/${this.spaceId}/resourcequota`, res, {
        params: {
          zone: this.zoneId,
        },
      });
    });
  }

  getResourceQuota() {
    return this.api.get(
      `spaces/${this.spaceId}/resourcequota`,
      {
        zone: this.zoneId,
      },
      { noNotify: true },
    );
  }

  checkRegistryAccount(data: any) {
    return this.api.post(`/registry/check`, data);
  }
}

export default new ZoneService();
