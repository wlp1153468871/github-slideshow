import API, { APIService } from './api';
import store from '@/core/store';

class ApplicationService {
  api: APIService;

  constructor() {
    this.api = API;
  }

  get zone() {
    return store.state.zone.id;
  }
  /**
   * get given space all instance
   * @param spaceId space id
   * @param zoneId
   */
  async listInstance(spaceId: string, zoneId: string) {
    return this.api.get(`/spaces/${spaceId}/instances`, { zoneId });
  }

  /**
   * get instance by id
   * @param instanceId instance id
   */
  async getInstance(instanceId: string) {
    return this.api.get(`/instances/${instanceId}`);
  }

  /**
   * get instance's secrets list
   * @param instanceId instance id
   */
  async getInstanceSecrets(instanceId: string) {
    return this.api.get(`/instances/${instanceId}/secrets`);
  }

  /**
   * create instance in space
   * @param spaceId space id
   * @param zone zone id
   * @param instance instance config
   */
  async createInstance(spaceId: string, zone: string, instance: object) {
    return this.api.post(`/spaces/${spaceId}/instances`, instance, {
      params: { zone },
    });
  }

  /**
   * get instance resource events
   * @param instanceId instance's id
   * @param zone zone' id
   * @param limit request events' size
   * @param timestamp begin time's timestamp, default are now
   */
  async listEvent(instanceId: string, zone: string, limit: number, timestamp: number) {
    return this.api.get(`/instances/${instanceId}/events`, {
      zone,
      limit,
      timestamp,
    });
  }

  async getInstanceYaml(instanceId: string) {
    return this.api.get(`/instances/${instanceId}/yaml`);
  }

  async updateInstanceYaml(instanceId: string, yaml: string) {
    return this.api.put(`/instances/${instanceId}/yaml`, yaml);
  }

  async getRecommendedName(spaceId: string, instanceName = '') {
    return this.api.get(`/spaces/${spaceId}/instances/recommended_name`, {
      need_recommend: true,
      instance_name: instanceName,
      zone: this.zone,
    });
  }

  async getInstancePod(spaceId: string, zone: string, appName: string) {
    return this.api.get(`/spaces/${spaceId}/monitoring/app/${appName}`, {
      zone,
    });
  }

  // by default get application monitor with 'jmx' type
  async getAppMonitor(
    pod: string,
    numberEx: number,
    name: string,
    spaceId: string,
    zone: string,
    from: string = '',
    to: string = '',
    type: string = 'jmx',
    refresh: string = '30s',
  ) {
    return this.api.get(`spaces/${spaceId}/monitoring/service/${name}/type/${type}`, {
      zone,
      pod,
      number: numberEx,
      from,
      to,
      refresh,
    });
  }
}

export default new ApplicationService();
