import saveRefreshTime from '@/core/utils/refresh-time';
import Vue from 'vue';
import store from '@/core/store';
import axios from 'axios';
import { get as getValue } from 'lodash';
import AuthService from '@/core/services/auth.service';
import Noty from 'noty';
import api from './';

const notyErrorOption = {
  killer: true,
  timeout: 2000,
  progressBar: true,
  layout: 'topCenter',
  type: 'error',
};
// const debug = process.env.NODE_ENV !== 'production';

function notifyErrorResponse(response, defaultMessage) {
  const msg = JSON.stringify(getValue(response, 'data.error_info') || getValue(response, 'data'));
  new Noty({
    ...notyErrorOption,
    text: msg || defaultMessage,
  }).show();
}

const refreshToken = (params, cb) => {
  if (!store.state.auth.isRefreshing) {
    store.commit('setRefreshingState', true);
    store.commit(
      'setRefreshingCall',
      axios.get('/v1/auth_token', { params }).then(({ data: { token } }) => {
        store.commit('saveToken', token);
        store.commit('setRefreshingState', false);
        store.commit('setRefreshingCall', null);
        return Promise.resolve(true);
      }),
    );
  }
  return store.state.auth.refreshingCall.then(() => cb());
};

const toLogin = (res = {}) => {
  notifyErrorResponse(res, '登录过期，请重新登录');
  store.dispatch('clearCache').then(router => {
    if (router.currentRoute.name !== 'login') {
      router.push({
        name: 'login',
        query: {
          redirect: router.currentRoute.fullPath,
        },
      });
    }
  });
};

/**
 * auth service handle global authorization
 */
export default {
  request(config) {
    if (!config.headers.Authorization && AuthService.getToken()) {
      config.headers.Authorization = `Bearer ${AuthService.getToken()}`;
    }
    if (!config.headers.AuthorizationScope) {
      const { url } = config;
      if (/spaces\//.test(url)) {
        /* 包含`spaces/`且不包含`?zoneId` */
        if (!config.params || (config.params && !Object.keys(config.params).some(key => key === 'zoneId'))) {
          const regex = /(?<=spaces\/)(.*?)(?=\/)/;
          const result = url.match(regex);
          if (result) {
            config.headers.AuthorizationScope = JSON.stringify({
              space_id: result[0],
            });
          }
          /* 包含`spaces/` || 包含 `?zoneId` */
        } else if (config.params && Object.keys(config.params).some(key => key === 'zoneId')) {
          if (store.getters.spaceId || store.getters.zoneId) {
            config.headers.AuthorizationScope = JSON.stringify({
              space_id: store.getters.spaceId,
              zone_id: config.params.zoneId,
            });
          }
        }/* 包含`instances/` */
      } else if (/instances\//.test(url)) {
        if (store.getters.spaceId || store.getters.zoneId) {
          config.headers.AuthorizationScope = JSON.stringify({
            space_id: store.getters.spaceId,
            zone_id: store.getters.zoneId,
          });
        }
        // 包含 `services/`
      } else if (/services\//.test(url)) {
        console.log(url);
        if (store.getters.spaceId || store.getters.zoneId) {
          config.headers.AuthorizationScope = JSON.stringify({
            space_id: store.getters.spaceId,
            zone_id: store.getters.zoneId,
          });
        }
        /* 包含`zones/`且不包含`?spaceId` */
      } else if (/zones\//.test(url) && (config.params && !Object.keys(config.params).some(key => key === 'spaceId'))) {
        config.headers.AuthorizationScope = JSON.stringify({
          platform_id: 'dsp',
        });
      } else if (/zones\//.test(url) && (config.params && Object.keys(config.params).some(key => key === 'spaceId'))) {
        if (store.getters.spaceId || store.getters.zoneId) {
          config.headers.AuthorizationScope = JSON.stringify({
            space_id: config.params.spaceId,
            zone_id: store.getters.zoneId,
          });
        }
      } else if (/authorizations\//.test(url)) {
        config.headers.AuthorizationScope = JSON.stringify({
          platform_id: 'dsp',
        });
      } else if (/organizations\//.test(url)) {
        const regex = /(?<=organizations\/)(.*?)(?=\/)/;
        const result = url.match(regex);
        if (result) {
          config.headers.AuthorizationScope = JSON.stringify({
            organization_id: result[0],
          });
        }
      } else if (/quota\/approval\//.test(url)) {
        if (store.getters.orgId) {
          config.headers.AuthorizationScope = JSON.stringify({
            platform_id: store.getters.orgId,
          });
        }
      } else if (/user\/approvals\//.test(url)) {
        if (store.getters.spaceId) {
          config.headers.AuthorizationScope = JSON.stringify({
            space_id: store.getters.spaceId,
          });
        }
      } else if (store.state.isManageView) { // 管理视图下的操作
        config.headers.AuthorizationScope = JSON.stringify({
          platform_id: 'dsp',
        });
      }
    }
    saveRefreshTime();
    return config;
  },

  // global ajax success handler
  response(res) {
    if (/^20\d/.test(res.status)) {
      if (res.headers.authorizationresult) {
        console.error(res.headers.authorizationresult);
        console.error(res.config.method, res.request.responseURL);
        // notifyErrorResponse({}, '后端无权限, 请联系管理员');
      }
      return res.data;
    }
    return res;
  },

  // global ajax error handler
  responseError(error) {
    const { response = {} } = error;
    if (response.status === 502) {
      notifyErrorResponse({}, '后端出问题了, 请联系管理员');
    } else if (response.status === 401 && response.data.message === '令牌已过期') {
      const nowTime = new Date();
      const refreshTime = new Date(Date.parse(Vue.ls.get('refreshTime')));
      // 在用户操作的活跃期内
      if (refreshTime && nowTime <= refreshTime) {
        return refreshToken(
          {
            refresh_token: Vue.ls.get('refresh_token'),
          },
          () => {
            error.config.headers.Authorization = `Bearer ${store.state.token}`;
            error.config.baseURL = undefined;
            return api.request(error.config);
          },
        ).catch(res => {
          if (getValue(res, 'response.status') === 401) {
            toLogin();
          }
          return Promise.reject(res);
        });
      }
      // 传递初始登录错误信息
      toLogin(response);
    } else if (response.status === 403) {
      if (getValue(response, 'headers.Authorization')) {
        notifyErrorResponse({}, '权限不足');
      } else {
        notifyErrorResponse(response);
      }
    } else if (!error.config.noNotify) {
      notifyErrorResponse(response, error.message);
    }

    return Promise.reject(response);
  },
};
