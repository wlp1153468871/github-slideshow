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
      if (store.isManageView) {
        config.headers.AuthorizationScope = JSON.stringify({
          platform_id: 'dsp',
        });
      } else {
        const { spaceId, orgId, zoneId } = store.getters;
        if (spaceId || orgId || zoneId) {
          config.headers.AuthorizationScope = JSON.stringify({
            space_id: spaceId,
            organization_id: orgId,
            zone_id: zoneId,
          });
        }
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
        console.error(res.request.responseURL);
        notifyErrorResponse({}, '后端无权限, 请联系管理员');
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
    } else if (response.status === 401 && response.data.message === 'token has expired') {
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
