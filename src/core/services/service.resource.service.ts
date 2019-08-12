import api, { APIService } from './api';
import store from '@/core/store';

class ServiceService {
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
    name,
    space = this.space,
    zone = this.zone,
  }: {
    name: string;
    space?: string;
    zone?: string;
  }) {
    return this.api.get(`/spaces/${space}/service/${name}`, { zone });
  }

  create({
    data,
    space = this.space,
    zone = this.zone,
  }: {
    data: any;
    space?: string;
    zone?: string;
  }) {
    return this.api.post(`/spaces/${space}/service`, data, {
      params: { zone },
    });
  }

  update({
    data,
    name,
    space = this.space,
    zone = this.zone,
  }: {
    data: any;
    name: any;
    space?: string;
    zone?: string;
  }) {
    return this.api.put(`/spaces/${space}/service/${name}`, data, {
      params: { zone },
    });
  }

  delete({
    name,
    space = this.space,
    zone = this.zone,
  }: {
    name: any;
    space?: string;
    zone?: string;
  }) {
    return this.api.delete(`/spaces/${space}/service/${name}`, { zone });
  }

  list({
    space = this.space,
    zone = this.zone,
  }: {
    space?: string;
    zone?: string;
  } = {}) {
    return this.api.get(`/spaces/${space}/service`, { zone });
  }

  getPods({
    name,
    space = this.space,
    zone = this.zone,
  }: {
    name: string;
    space?: string;
    zone?: string;
  }) {
    return this.api.get(`/spaces/${space}/service/${name}/pods`, { zone });
  }

  getEvents({
    name,
    space = this.space,
    zone = this.zone,
  }: {
    name: string;
    space?: string;
    zone?: string;
  }) {
    return this.api.get(`/spaces/${space}/service/${name}/events`, { zone });
  }

  getRoutes({
    name,
    space = this.space,
    zone = this.zone,
  }: {
    name: string;
    space?: string;
    zone?: string;
  }) {
    return this.api.get(`/spaces/${space}/service/${name}/routes`, { zone });
  }
}

export default new ServiceService();
