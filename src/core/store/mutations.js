import Vue from 'vue';
import {
  ORG_ROLE,
  PLATFORM_ROLE,
  SPACE_ROLE,
  ZONE_ROLE,
} from '@/core/constants/role';
import QuotaService from '@/core/services/quota.service';
import SSOService from '@/core/services/sso.service';
import StorageCache from '@/core/services/storage.cache';
import router from '@/view/router';
import {
  LOCAL_ACCOUNT_KEY,
  LS_KYES,
  SYNC_STATUS,
} from '@/core/constants/constants';
import CatalogService from '@/core/services/catalog.service';
import AuthService from '@/core/services/auth.service';
import OrgService from '@/core/services/org.service';
import SpaceService from '@/core/services/space.service';
import SystemService from '@/core/services/system.service';
import ZoneService from '@/core/services/zone.service';
import APIResourceService from '@/core/services/api-resource.service';
import CategoryUtil from '@/core/utils/category-util';
import getRoutePath from '@/view/router/util/router-map';
import {
  find,
  isEmpty,
  first,
  groupBy,
  get as getValue,
  uniqBy,
  flatten,
  intersectionWith,
} from 'lodash';
import {
  DEFAULT_RESOURCE,
  mergeDefaultHelpUrls,
} from '@/core/constants/resource';
import * as types from './mutation-types';

export const state = {
  user: {},
  org: {},
  orgs: [],
  space: {},
  spaces: [],
  zone: {},
  zones: [],
  services: [],
  defaultActiveMenu: 'console.dashboard',
  chargingEnable: false,
  helpURLDict: {},
  loadings: {
    initTenantView: false,
  },
  theme: {
    productName: '',
    appPicture: {
      loginPicture: '',
      navPicture: '',
      favicon: '',
    },
  },
  category: null,
  filteredCategory: null,
  isCollapse: false,
  quotaDict: {},
  sgmLoginURL: null,
  sgmLogoutURL: null,
  sgmSso: {},
  token: null,
  auth: {
    isRefreshing: false,
    refreshingCall: null,
  },
  apiResource: null,
};

/* eslint-disable no-shadow */
export const getters = {
  isLocalAccount(state) {
    return state.user.registry_location === LOCAL_ACCOUNT_KEY;
  },

  isPlatformAdmin(state) {
    return state.user.platform_role === PLATFORM_ROLE.ADMIN;
  },

  isOrganizationAdmin(state, getters) {
    return (
      getters.isPlatformAdmin || state.user.organization_role === ORG_ROLE.ADMIN
    );
  },

  isSpaceAdmin(state, getters) {
    return (
      getters.isPlatformAdmin || state.user.space_role === SPACE_ROLE.ADMIN
    );
  },

  zoneUnauthorized(state) {
    return (
      getValue(
        find(state.user.zone_space_roles, { zone_id: state.zone.id }),
        'zone_role',
        ZONE_ROLE.UNAUTHORIZED,
      ) === ZONE_ROLE.UNAUTHORIZED
    );
  },

  isZoneSyncing(state) {
    return state.zone.syncStatus === SYNC_STATUS.SYNCING;
  },

  orgId(state) {
    return state.org.id;
  },

  spaceId(state) {
    return state.space.id;
  },

  orgSpaces(state) {
    if (!state.org || !state.org.id) return [];
    return state.spaces.filter(x => x.organization_id === state.org.id);
  },

  zoneId(state) {
    return state.zone.id;
  },

  theme(state) {
    return state.theme;
  },

  getOrgSpaces: state => orgId => {
    if (!state.orgs) return [];
    return state.spaces.filter(x => x.organization_id === orgId);
  },

  getService: state => id => {
    console.log(`查询ID为 [${id}] 的 Service`);
    const service = find(state.services, { id });
    if (service) {
      console.log('查询成功', service);
      return service;
    }
    throw new Error(`没有查找到ID为 [${id}] 的Service`);
  },
};

export const actions = {
  loadTheme({ commit }) {
    return SystemService.getTheme().then(theme => {
      commit(types.LOAD_THEME_SUCCESS, { theme });
      SystemService.setDocumentTheme(theme);
    });
  },

  updateTheme({ commit }, theme) {
    return SystemService.updateTheme(theme).then(() => {
      commit(types.UPDATE_THEME_SUCCESS, { theme });
      SystemService.setDocumentTheme(theme);
    });
  },

  getUserInfo({ commit }) {
    return new Promise((resolve, reject) => {
      AuthService.getUserInfo()
        .then(user => {
          commit('LOAD_USER_SUCCESS', { user });
          resolve(user);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  loadSSOInfo({ commit }) {
    return SSOService.getIdentityProvider().then(providers => {
      const ssoInfo = first(providers) || {};
      const login_url = getValue(ssoInfo, 'login_url');
      const logout_url = getValue(ssoInfo, 'logout_url');
      commit(types.SET_SGM_SSO, ssoInfo);
      commit(types.SET_SGM_LOGIN_URL, login_url);
      commit(types.SET_SGM_LOGOUT_URL, logout_url);
    });
  },

  logout({ dispatch }) {
    return AuthService.logout().then(() => {
      dispatch('clearCache');
    });
  },

  clearCache({ state, getters, commit }) {
    return new Promise(resolve => {
      const willRedirect = !getters.isLocalAccount && state.sgmLogoutURL;
      commit(types.RESET_APPLICATION);
      if (willRedirect) window.open(state.sgmLogoutURL, '_self');
      resolve(router);
    });
  },

  initTenantView({ dispatch, commit, state }) {
    commit(types.INIT_TENANT_VIEW_REQUEST);
    dispatch('loadSSOInfo');
    dispatch('loadQuotaField');
    dispatch('loadSpaces')
      .then(() => {
        dispatch('loadZones').then(() => {
          dispatch('getUserInfo').then(() => {
            if (state.zones.length) {
              dispatch('initPortal');
            } else {
              commit(types.INIT_TENANT_VIEW_SUCCESS);
            }
          });
        });
      })
      .catch(() => {
        commit(types.INIT_TENANT_VIEW_SUCCESS);
      });
  },

  initManageView({ dispatch }) {
    dispatch('loadQuotaField');
    dispatch('loadSSOInfo');
  },

  initPortal({ dispatch }) {
    dispatch('loadBrokerService').then(() => {
      dispatch('loadCategory');
    });
  },

  loadQuotaField({ commit }) {
    return QuotaService.listQuotaFields().then(res => {
      commit(types.LOAD_QUOTA_FIELD, res);
    });
  },

  loadCategory({ commit }) {
    return CatalogService.getSchema().then(res => {
      commit(types.LOAD_CATEGORY, res);
    });
  },

  loadBrokerService({ commit, state }) {
    return SpaceService.listBrokerServices(state.space.id, {
      zoneId: state.zone.id,
    }).then(services => {
      const { broker_services } = services;
      broker_services.forEach(bs => {
        bs.route = getRoutePath(bs);
      });
      commit(types.LOAD_SERVICE_SUCCESS, broker_services);
      commit(types.INIT_TENANT_VIEW_SUCCESS);
    });
  },

  loadSystemSettings({ commit }) {
    return SystemService.getSystemSettings().then(param => {
      commit(types.LOAD_SYSTEM_SETTINGS_SUCCESS, { param });
    });
  },

  loadSpaces({ commit }) {
    return new Promise((resolve, reject) => {
      Promise.all([
        OrgService.getUserOrgs(),
        SpaceService.getUserSpaces(),
      ]).then(([orgs, spaces]) => {
        if (isEmpty(spaces)) {
          router.push({ name: '403' });
          reject(new Error('no space'));
        }

        const dict = groupBy(spaces, 'organization_id');
        orgs.forEach(org => {
          if (dict[org.id]) {
            org.children = dict[org.id];
          } else {
            org.disabled = true;
          }
        });
        orgs = orgs.filter(org => !org.disabled);
        commit(types.LOAD_SPACE_SUCCESS, { orgs, spaces });

        // handle selected org
        let org = OrgService.getLocalOrg();
        if (org && org.id) org = orgs.find(x => x.id === org.id);

        if (!org || !org.id) {
          org = first(orgs);
        }

        if (org) {
          commit(types.SWITCH_ORG, { org });
          OrgService.setLocalOrg(org);
        }

        // handle selected space
        let space = SpaceService.getLocalSpace();
        if (space && space.id) space = spaces.find(x => x.id === space.id);

        if (!space || !space.id) {
          space = first((org || {}).children);
        }

        if (space) {
          SpaceService.setLocalSpace(space);
          commit(types.SWITCH_SPACE, { space });
        }

        resolve();
      });
    });
  },

  loadZones({ dispatch, commit, state }) {
    return ZoneService.getOrgZones(state.org.id).then(zones => {
      commit(types.LOAD_ZONE_SUCCESS, { zones });

      // get localStorage saved zone;
      let zone = ZoneService.getLocalZone();

      if (zone && zone.id) {
        // in case localStorage tenant info is expired.
        zone = zones.find(x => x.id === zone.id);
      }

      if (!zone) {
        zone = first(zones) || {};
        ZoneService.setLocalZone(zone);
      }

      commit(types.SWITCH_ZONE, { zone });

      dispatch('loadAPIResource');
    });
  },

  switchOrg({ dispatch, commit }, { org, space }) {
    commit(types.SWITCH_ORG, { org });
    OrgService.setLocalOrg(org);
    dispatch('switchSpace', { space });
  },

  switchSpace({ dispatch, commit }, { space }) {
    commit(types.SWITCH_SPACE, { space });
    SpaceService.setLocalSpace(space);

    dispatch('loadZones').then(() => {
      if (state.zones.length) {
        const zone = first(state.zones);
        dispatch('switchZone', { zone });
        router.push({
          name: 'console',
        });
      } else {
        Vue.noty.error('暂无可用区');
      }
    });
  },

  switchZone({ dispatch, commit }, { zone }) {
    commit(types.SWITCH_ZONE, { zone });
    ZoneService.setLocalZone(zone);

    dispatch('getUserInfo').then(() => {
      dispatch('initPortal');
    });
  },

  loadAPIResource({ commit, state }) {
    APIResourceService.list(state.zone).then(resources => {
      const simplifiedResourceList = uniqBy(
        flatten(resources.map(resourceList => resourceList.resources)),
        'kind',
      );

      const filteredResourceList = intersectionWith(
        simplifiedResourceList,
        DEFAULT_RESOURCE,
        (x, y) => {
          return x.kind === y;
        },
      );

      const resourceMap = {};
      filteredResourceList.forEach(resource => {
        resourceMap[resource.kind] = resource;
      });

      commit(types.LOAD_API_RESOURCE, resourceMap);
    });
  },
};

export const mutations = {
  saveToken(state, data) {
    state.token = data;
    Vue.ls.set(LS_KYES.TOKEN, data);
  },

  setRefreshingState(state, data) {
    state.auth.isRefreshing = data;
  },

  setRefreshingCall(state, data) {
    state.auth.refreshingCall = data;
  },

  [types.LOAD_QUOTA_FIELD](state, res = []) {
    const quotaDict = {};
    res.forEach(quota => {
      quotaDict[quota.code] = quota;
    });
    state.quotaDict = quotaDict;
  },

  [types.LOAD_CATEGORY](state, category) {
    state.category = CategoryUtil.map2Array(category);
    state.filteredCategory = CategoryUtil.map2FilterArray(category);
  },

  [types.IS_COLLAPSE](state, isCollapse) {
    state.isCollapse = isCollapse;
  },

  [types.LOAD_USER_SUCCESS](state, { user }) {
    state.user = user;
  },

  [types.LOAD_SPACE_SUCCESS](state, { orgs, spaces }) {
    if (orgs) {
      state.orgs = orgs;
    }
    state.spaces = spaces;
  },

  [types.LOAD_ZONE_SUCCESS](state, { zones }) {
    state.zones = zones;
  },

  [types.SWITCH_ZONE](state, { zone }) {
    state.zone = zone;
  },

  [types.SWITCH_ORG](state, { org }) {
    state.org = org;
  },

  [types.SWITCH_SPACE](state, { space }) {
    state.space = space;
  },

  [types.INIT_TENANT_VIEW_REQUEST](state) {
    state.loadings.initTenantView = true;
  },

  [types.INIT_TENANT_VIEW_SUCCESS](state) {
    state.loadings.initTenantView = false;
  },

  [types.LOAD_SERVICE_SUCCESS](state, services) {
    state.services = services;
  },

  [types.RESET_APPLICATION](state) {
    StorageCache.clear();
    state.user = {};
    state.zone = {};
    state.zones = [];
    state.services = [];
    state.user = {};
    state.org = {};
    state.orgs = [];
    state.space = {};
    state.spaces = [];
    state.loadings = {
      initTenantView: false,
    };
  },

  [types.LOAD_THEME_SUCCESS](state, { theme }) {
    if (isEmpty(theme)) {
      theme = {
        productName: '',
        appPicture: {
          loginPicture: '',
          navPicture: '',
          favicon: '',
        },
      };
    }
    state.theme = theme;
  },

  [types.UPDATE_THEME_SUCCESS](state, { theme }) {
    if (isEmpty(theme)) {
      theme = {
        productName: '',
        appPicture: {
          loginPicture: '',
          navPicture: '',
          favicon: '',
        },
      };
    }
    state.theme = theme;
  },

  [types.LOAD_SYSTEM_SETTINGS_SUCCESS](state, { param }) {
    state.helpURLDict = mergeDefaultHelpUrls(getValue(param, 'helpURLDict'));
  },

  [types.SET_DEFAULT_ACTIVE_MENU](state, menu) {
    state.defaultActiveMenu = menu;
  },

  [types.SET_SGM_LOGIN_URL](state, url) {
    state.sgmLoginURL = url;
  },

  [types.SET_SGM_LOGOUT_URL](state, url) {
    state.sgmLogoutURL = url;
  },

  [types.SET_SGM_SSO](state, sso) {
    state.sgmSso = sso;
  },

  [types.LOAD_API_RESOURCE](state, resourceMap) {
    state.apiResource = resourceMap;
  },
};
/* eslint-enable no-shadow */
