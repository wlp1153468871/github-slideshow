import Rest from './rest';

interface INTERCEPTOR {
  response?<A = any>(res: A): A;
  request?<B = any>(config: B): B;
  responseError?(error: any): any;
  requestError?(error: any): any;
}

export default class APIService extends Rest {
  constructor(baseUrl: string, interceptor: INTERCEPTOR) {
    super(baseUrl || '');
    this.useInterceptor(interceptor || {});
  }
}


