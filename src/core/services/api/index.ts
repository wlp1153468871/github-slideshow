import ApiService from './api.service';
import AuthInterceptor from './auth.interceptor';

export default new ApiService('/v1', AuthInterceptor);
export { ApiService as APIService };
