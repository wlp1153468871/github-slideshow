import api from './api';

class SSOService {
  constructor() {
    this.api = api;
  }

  getSSO() {
    return this.api.get('/settings/sso');
  }

  updateSSO(enableLocalLogin) {
    return this.api.put('/settings/sso', enableLocalLogin);
  }

  getIdentityProvider() {
    return this.api.get('/settings/sso/identity-provider');
  }

  createIdentityProvider(params) {
    return this.api.post('/settings/sso/identity-provider', params);
  }

  updateIdentityProvider(ssoIdentityProviderId, params) {
    return this.api.put(
      `/settings/sso/identity-provider/${ssoIdentityProviderId}`,
      params,
    );
  }
}

export default new SSOService();
