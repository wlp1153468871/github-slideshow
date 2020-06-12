import APIService from './api.service';
import AuthInterceptor from './auth.interceptor';
// eslint-disable-next-line
const instance: APIService  = new APIService('/v1', AuthInterceptor);
export default instance;
export { APIService as APIService };
