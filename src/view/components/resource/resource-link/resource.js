import { get as getValue } from 'lodash';
import store from '@/core/store';

export default class Resource {
  kind = '';
  apiResource = store.state.apiResource;
  instanceName = null;

  constructor(kind, instanceName) {
    this.kind = kind;
    this.instanceName = instanceName;
  }

  set name(name) {
    this.instanceName = name;
  }

  get name() {
    return getValue(this.apiResource, `${this.kind}.name`);
  }

  get route() {
    const { name } = this;
    if (!name) return { name: 'console.gateway' };
    if (this.instanceName) {
      return {
        name: `resource.${name}.detail`,
        params: { name: this.instanceName },
      };
    }
    return {
      name: `resource.${name}.list`,
    };
  }

  get deployRoute() {
    const { name } = this;
    if (!name) return { name: 'console.gateway' };
    return {
      name: `deploy.${name}`,
      query: {
        create: true,
      },
    };
  }

  get icon() {
    return `resource-${this.name}`;
  }
}
