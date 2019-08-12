import api, { APIService } from './api';
import WebSocketService from './web-socket.service';
import store from '@/core/store';

class PodService {
  api: APIService;

  constructor() {
    this.api = api;
  }

  get space(): string {
    return store.getters.spaceId;
  }

  get zone(): string {
    return store.state.zone.id;
  }

  get({
    podName,
    space = this.space,
    zone = this.zone,
  }: {
    podName: string;
    space?: string;
    zone?: string;
  }) {
    return this.api.get(`/spaces/${space}/pods/${podName}`, { zone });
  }

  list({
    space = this.space,
    zone = this.zone,
  }: {
    space?: string;
    zone?: string;
  }) {
    return this.api.get(`/spaces/${space}/pods`, { zone });
  }

  delete({
    podName,
    space = this.space,
    zone = this.zone,
  }: {
    podName: string;
    space?: string;
    zone?: string;
  }) {
    return this.api.delete(`/spaces/${space}/pods/${podName}`, { zone });
  }

  batchDelete({
    space = this.space,
    zone = this.zone,
    names = [],
  }: {
    names: string[];
    space?: string;
    zone?: string;
  }) {
    return this.api.delete(`/spaces/${space}/pods`, { zone, names });
  }

  getEvents({
    podName,
    space = this.space,
    zone = this.zone,
  }: {
    podName: string;
    space?: string;
    zone?: string;
  }) {
    return this.api.get(`spaces/${space}/pods/${podName}/events`, { zone });
  }

  getPodShell({
    pod,
    container,
    shell = 'bash',
    space = this.space,
    zone = this.zone,
  }: {
    pod: string;
    container: string;
    shell?: string;
    space?: string;
    zone?: string;
  }) {
    return this.api.get(`/spaces/${space}/pods/${pod}/shell/${container}`, {
      zone,
      shell,
    });
  }

  getRealTimeLogs({
    pod,
    container,
    space,
    zone = this.zone,
  }: {
    pod: string;
    container: string;
    space: string;
    zone?: string;
  }) {
    const params = new URLSearchParams();
    params.append('zone', zone);
    params.append('container', container);
    params.append('follow', 'true');
    return WebSocketService.createWebSocket(
      `/app-server/v1/namespaces/${space}/pods/${pod}/log?${params.toString()}`,
    );
  }

  saveFile({
    pod,
    space = this.space,
    zone = this.zone,
    containerName,
    path,
  }: {
    pod: string;
    containerName: string;
    path: string;
    space?: string;
    zone?: string;
  }) {
    return this.api
      .get(
        `/spaces/${space}/pods/${pod}/download`,
        { zone, path, containerName },
        {
          responseType: 'blob',
        },
      )
      .then((res: any) => {
        return new Blob([res], { type: 'application/x-tar' });
      });
  }
}

export default new PodService();
