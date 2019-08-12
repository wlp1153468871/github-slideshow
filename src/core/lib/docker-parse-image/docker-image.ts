export default class DockerImage {

  registry: string;
  namespace: string;
  repository: string;
  tag: string;

  constructor(
    registry: string,
    namespace: string,
    repository: string,
    tag: string,
  ) {
    this.registry = registry;
    this.namespace = namespace;
    this.repository = repository;
    this.tag = tag;
  }

  private get _registry() {
    const { registry } = this;
    return registry ? `${registry}/` : '';
  }

  private get _namespace() {
    const {namespace } = this;
    return namespace && namespace !== 'library' ? `${namespace}/` : '';
  }

  private get _tag() {
    const { tag } = this;
    return tag && tag !== 'latest' ? `:${tag}` : '';
  }

  get name(): string {
    return this._registry + this._namespace + this.repository + this._tag;
  }

  get fullname(): string {
    return this._registry + (this._namespace || 'library/') + this.repository + (this._tag || ':latest');
  }
}
