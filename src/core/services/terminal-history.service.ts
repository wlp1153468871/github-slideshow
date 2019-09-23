import api, { APIService } from './api';
class TerminalHistoryService {
  api: APIService;

  constructor() {
    this.api = api;
  }

  saveTerminalHistories(spaceId: string, zone: string, podName: string, containerName: string, query: object) {
    return this.api.post(`/spaces/${spaceId}/pods/${podName}/containers/${containerName}/cmd`, query, {
      params: { zone },
    });
  }

  ListTerminalHistories(spaceId: string, podName: string, containerName: string, query: object) {
    return this.api.get(
      `/spaces/${spaceId}/pods/${podName}/containers/${containerName}/cmd`,
      query,
    );
  }

  ListOperatingData(spaceId: string, resourceName: string, query: object) {
    return this.api.get(
      `/spaces/${spaceId}/resources/${resourceName}/cmd`,
      query,
    );
  }
}

export default new TerminalHistoryService();
