import store from '@/core/store';
import { APIService } from './api';
import api from './api';

class NodeService {
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
    return this.api.get(`/nodes`, {zone: zoneId || this.zoneId});
  }

  /**
   * update zones
   * @param zone
   * @param zoneId
   */
  updateNode(name: string, node: any, zoneId: string) {
    return this.api.put(`/nodes/${name}`, node,
    {
      params: { zone: zoneId },
    });
  }

  getNodeDetail(name: string, zoneId: string) {
    return this.api.get(`/nodes/${name}`,
    {
      zone: zoneId,
    });
  }

  getEvents(name: string, zoneId: string) {
    return this.api.get(`/nodes/${name}/events`,
    {
      zone: zoneId,
    });
  }

  getPods(name: string, zoneId: string) {
    return this.api.get(`/nodes/${name}/pods`,
    {
      zone: zoneId,
    });
  }

  getPodsDetail(namespace: string, podName: string, zoneId: string) {
    return this.api.get(`/namespaces/${namespace}/pods/${podName}`,
    {
      zone: zoneId,
    });
  }

  deletePods(namespace: string, podName: string, zoneId: string) {
    return this.api.delete(`/namespaces/${namespace}/pods/${podName}`,
    {
      zone: zoneId,
    });
  }

  getPodsEvents(namespace: string, podName: string, zoneId: string) {
    return this.api.get(`/namespaces/${namespace}/pods/${podName}/events`,
    {
      zone: zoneId,
    });
  }

  ListTerminalHistories(namespace: string, podName: string, containerName: string, zoneId: string, query: object) {
    return this.api.get(`/namespaces/${namespace}/pods/${podName}/containers/${containerName}/cmd`,
    {
      zone: zoneId,
      query,
    });
  }

  executePodsCmd(namespace: string, podName: string, containerName: string, zoneId: string, query: object,) {
    return this.api.post(`/namespaces/${namespace}/pods/${podName}/containers/${containerName}/cmd`,
      query,
      {
        params: { zone: zoneId },
      },);
  }

  getPodShell(namespace: string, podName: string, containerName: string, zoneId: string) {
    return this.api.get(`/namespaces/${namespace}/pods/${podName}/containers/${containerName}/shell`,
    {
      zone: zoneId,
    });
  }

  getPodRealTimeLogssessionId(namespace: string, podName: string, containerName: string, zoneId: string) {
    return this.api.get(`/namespaces/${namespace}/pods/${podName}/log`,
    {
      zone: zoneId,
      container_name: containerName,
      follow: true,
    });
  }

  listPodLogs(namespace: string, podName: string, containerName: string, zoneId: string, query = {}) {
    return this.api.get(`/namespaces/${namespace}/pods/${podName}/offlog`,
    {
      zone: zoneId,
      container_name: containerName,
      ...query,
    });
  }

  listSecret(namespace: string, zoneId: string) {
    return this.api.get(`/namespaces/${namespace}/secrets`,
    {
      zone: zoneId,
    });
  }

  listConfigMap(namespace: string, zoneId: string) {
    return this.api.get(`/namespaces/${namespace}/configmaps`,
    {
      zone: zoneId,
    });
  }

  fetchContainerMonitorUrl(
    namespace: string,
    podName: string,
    instance: string,
    numberEx: string,
    from: string,
    to: string,
    zoneId: string,
    refresh: string,
    ) {
    return this.api.get(`/namespaces/${namespace}/monitoring/instance/${instance}/number/${numberEx}`,
     {
       zone: zoneId,
        pod: podName,
        from,
        to,
        refresh,
    });
  }

  downloadLog(namespace: string, podName: string, containerName: string, zoneId: string, query: string) {
   return this.api.get(`/namespaces/${namespace}/pods/${podName}/log/download`,
   {
      zone: zoneId,
      container_name: containerName,
      query,
      responseType: 'blob',
    });
  }

  saveFile(namespace: string, podName: string, containerName: string, zoneId: string, path: string) {
    return this.api.get(`/namespaces/${namespace}/pods/${podName}/download`,
    {
      zone: zoneId,
      containerName,
      path,
    });
  }
}

export default new NodeService();
