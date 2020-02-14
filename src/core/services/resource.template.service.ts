import { pick } from 'lodash';
import { APIService } from './api';
import AuthInterceptor from './api/auth.interceptor';

class ResourceTemplateService {
  private api: APIService;

  constructor() {
    this.api = new APIService('/workloads', pick(AuthInterceptor, ['response', 'request']));
  }

  getTemplate(type: string) {
    return this.api.get(`/${type}.json`);
  }
}

export default new ResourceTemplateService();
