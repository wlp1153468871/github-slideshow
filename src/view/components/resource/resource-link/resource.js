import { get as getValue } from 'lodash';
import store from '@/core/store';

export default class Resource {
  kind = '';
  apiResource = {};
  instanceName = null;
  unwatch = () => {};

  constructor(kind, instanceName) {
    this.kind = kind;
    this.instanceName = instanceName;
    this.unwatch = store.watch(
      x => x.apiResource,
      resource => {
        this.apiResource = resource;
      },
      {
        immediate: true,
      },
    );
  }

  get name() {
    return getValue(this.apiResource, `${this.kind}.name`);
  }

  get route() {
    const { name } = this;
    if (!name) return { name: 'console.dashboard' };
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

  get icon() {
    return `resource-${this.name}`;
  }
}
