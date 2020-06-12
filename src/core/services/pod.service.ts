import api, { APIService } from './api';
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

  list({ space = this.space, zone = this.zone }: { space?: string; zone?: string }) {
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
    shell = 'sh',
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

  getPodRealTimeLogssessionId(
    spaceId: string,
    podName: string,
    zone: string,
    container: string,
  ) {
    return this.api.get(
      `/spaces/${spaceId}/pods/${podName}/log?zone=${zone}&container_name=${container}&follow=true`,
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

  fetchContainerMonitorUrl({
    pod,
    instance,
    numberEx,
    space = this.space,
    zone = this.zone,
    from = '',
    to = '',
    refresh = '',
  }: {
    pod: string;
    instance: string;
    numberEx: string;
    space?: string;
    zone?: string;
    from?: string;
    to?: string;
    refresh?: string;
  }) {
    return this.api.get(`/spaces/${space}/monitoring/instance/${instance}/number/${numberEx}`, {
      zone,
      pod,
      from,
      to,
      refresh,
    });
  }
}

export default new PodService();
