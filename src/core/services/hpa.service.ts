import { filter } from 'lodash';
import api, { APIService } from './api';
import store from '@/core/store';

class HPAService {
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

  list({
    space = this.space,
    zone = this.zone,
  }: {
    space?: string;
    zone?: string;
  } = {}) {
    return this.api.get(`/spaces/${space}/horizontalpodautoscalers`, {
      zone,
    });
  }

  filterHPA(hpaResources: any[], kind: string, name: string) {
    return filter(hpaResources, hpa => {
      return (
        hpa.spec.scaleTargetRef.kind === kind &&
        hpa.spec.scaleTargetRef.name === name
      );
    });
  }

  update(
    {
      name,
      data,
      space = this.space,
      zone = this.zone,
    }: {
      name: string;
      data: any;
      space?: string;
      zone?: string;
    } = { name: '', data: {} },
  ) {
    if (!name) return Promise.reject();
    return this.api.put(
      `spaces/${space}/horizontalpodautoscalers/${name}`,
      data,
      {
        params: {
          zone,
        },
      },
    );
  }

  delete(
    {
      name,
      space = this.space,
      zone = this.zone,
    }: {
      name: string;
      space?: string;
      zone?: string;
    } = { name: '' },
  ) {
    if (!name) {
      return Promise.reject(new Error('no hpa name'));
    }
    return this.api.delete(
      `/spaces/${space}/horizontalpodautoscalers/${name}`,
      { zone },
    );
  }
}

export default new HPAService();
