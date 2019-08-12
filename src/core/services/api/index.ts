import Rest from './rest';
import AuthInterceptor from './auth.interceptor';

export class APIService extends Rest {
  constructor() {
    super('/v1');
    this.useInterceptor(AuthInterceptor);
  }

  create(url = '', config: {}) {
    return new Rest(url, config);
  }
}

export default new APIService();
