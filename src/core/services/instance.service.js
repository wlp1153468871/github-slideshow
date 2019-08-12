import api from './api';

class InstanceService {
  constructor() {
    this.api = api;
  }

  /**
   * create a service instance;
   * @param {String} spaceId space id
   * @param {String} serviceId service id
   * @param {Object} params params object
   */
  createInstance(spaceId, serviceId, params) {
    return this.api.post(`/spaces/${spaceId}/services/${serviceId}/instances`, params);
  }

  getInstance(instanceId) {
    return this.api.get(`/instances/${instanceId}`);
  }

  deleteInstance(instanceId) {
    return this.api.delete(`/instances/${instanceId}`);
  }

  getActions(instanceId) {
    return this.api.get(`/instances/${instanceId}/actions`);
  }

  /**
   * [ Route ] 对实例进行某个操作
   * @param {*} instanceId 实例ID
   * @param {*} action
   * @param:Object {id: [update|confirm|cancel]}
   */
  executeActions(instanceId, action = {}) {
    const { id, name, params = [] } = action;
    return this.api.post(`/instances/${instanceId}/ops`, {
      id,
      name,
      params,
    });
  }

  getLogs(instanceId, limit, offset) {
    return this.api.get(`/instances/${instanceId}/ops_log`, {
      limit,
      offset,
    });
  }

  /**
   * update instance
   * @param {*} instanceId instance id
   * @param params
   * @param action
   * @param {String} params.plan_id
   */
  doInstanceUpdate(instanceId, params, action = {}) {
    const { id = 'update', name = '更新' } = action;
    return this.api.post(`/instances/${instanceId}/ops`, {
      id,
      name,
      ...params,
    });
  }
}

export default new InstanceService();
