import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  AxiosPromise,
  CancelTokenSource,
} from 'axios';

class Rest {
  endPointURL: string;
  rest: AxiosInstance;

  constructor(endPointURL: string, config = {}) {
    const axiosConfig: AxiosRequestConfig = Object.assign(
      {
        baseURL: endPointURL,
      },
      config,
    );
    this.endPointURL = endPointURL;
    this.rest = axios.create(axiosConfig);
  }

  /**
   * export original axios request function.
   * @param config see https://github.com/axios/axios#axiosrequestconfig-1
   */
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T> {
    return this.rest.request(config);
  }

  get<T>(
    url: string,
    params?: {},
    config?: AxiosRequestConfig & { noNotify?: boolean },
  ): AxiosPromise<T> {
    const getConfig = {};
    if (params) Object.assign(getConfig, { params });
    if (config) Object.assign(getConfig, config);
    return this.rest.get<T>(url, getConfig);
  }

  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): AxiosPromise<T> {
    return this.rest.post(url, data, config);
  }

  delete(url: string, params?: {}, config?: AxiosRequestConfig): AxiosPromise {
    const delConfig = {};
    if (params) Object.assign(delConfig, { params });
    if (config) Object.assign(delConfig, config);
    return this.rest.delete(url, delConfig);
  }

  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): AxiosPromise<T> {
    return this.rest.put(url, data, config);
  }

  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): AxiosPromise<T> {
    return this.rest.patch(url, data, config);
  }

  createCancelSource(): CancelTokenSource {
    return axios.CancelToken.source();
  }

  useInterceptor(interceptor: any) {
    const { request, response, responseError } = interceptor;
    if (request) {
      this.rest.interceptors.request.use(request);
    }
    if (response || responseError) {
      this.rest.interceptors.response.use(response, responseError);
    }
  }
}

export default Rest;
