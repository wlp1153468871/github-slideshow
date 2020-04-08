import Vue from 'vue';
import { isEmpty } from 'lodash';
import store from '@/core/store';
import StorageCache from './storage.cache';
import api from './api';

/**
 * @kind mix.service
 */
class AuthService {
  constructor() {
    this.api = api;
  }

  get space() {
    return store.getters.spaceId;
  }

  get zone() {
    return store.state.zone.id;
  }

  login(username, password) {
    return this.api
      .post('/login', {
        username,
        password,
      }, {
        noNotify: true,
      })
      .then(res => {
        const { token, refresh_token } = res;
        Vue.ls.set('refresh_token', refresh_token);
        store.commit('saveToken', token);
      })
      .catch(err => {
        StorageCache.removeToken();
        return Promise.reject(err);
      });
  }

  ssoLogin(ssoToken, providerId) {
    return this.api
      .post('/sso_login', {
        identity_provider_id: providerId,
        sso_token: ssoToken,
      })
      .then(res => {
        const { token, refresh_token } = res;
        Vue.ls.set('refresh_token', refresh_token);
        store.commit('saveToken', token);
      });
  }

  logout() {
    return this.api.post('/logout');
  }

  getUserInfo(query = {
    zone_id: this.zone,
    space_id: this.space,
  }) {
    return this.api.get('/user/info', query);
  }

  getToken() {
    return StorageCache.getToken();
  }

  setToken(token) {
    return StorageCache.saveToken(token);
  }

  isAuthed() {
    const token = this.getToken();
    return !isEmpty(token);
  }
}

export default new AuthService();
