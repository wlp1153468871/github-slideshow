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

  updateIdentityProvider(params) {
    return this.api.put(`/settings/sso/identity-provider/${params.id}`, params);
  }

  deleteIdentityProvider(ssoIdentityProviderId) {
    return this.api.delete(`/settings/sso/identity-provider/${ssoIdentityProviderId}`);
  }
}

export default new SSOService();
