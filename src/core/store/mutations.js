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
  SPACE_LABEL,
  ORG_LABEL,
  ORG_SPACE,
  AREA_ENV,
  ZONE_LABEL,
} from '@/core/constants/constants';
import CatalogService from '@/core/services/catalog.service';
import AuthService from '@/core/services/auth.service';
import OrgService from '@/core/services/org.service';
import SpaceService from '@/core/services/space.service';
import SystemService from '@/core/services/system.service';
import ZoneService from '@/core/services/zone.service';
import APIResourceService from '@/core/services/api-resource.service';
import CategoryUtil from '@/core/utils/category-util';
import getListPath from '@/view/router/util/resource-list-map';
import {
  find,
  isEmpty,
  first,
  groupBy,
  get as getValue,
  uniqBy,
  flatten,
  intersectionWith,
  pick,
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
    alarmListView: false,
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
  openedMenus: [],
  alarm: {
    rules: [],
  },
};

/* eslint-disable no-shadow */
export const getters = {
  spaceDescription() {
    return SPACE_LABEL;
  },

  orgDescription() {
    return ORG_LABEL;
  },

  tenantDescription() {
    return ORG_SPACE;
  },

  zoneDescription() {
    return AREA_ENV;
  },

  envDescription() {
    return ZONE_LABEL;
  },

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

  alarmAdminAccessed(state, getters) {
    return (
      getters.isPlatformAdmin || getters.isOrganizationAdmin || getters.isSpaceAdmin
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
    const service = find(state.services, { id });
    if (service) return service;
    throw new Error(`没有查找到ID为 [${id}] 的Service`);
  },

  gerResourceForHeader: state => (kind, name) => {
    const resource = getValue(state.apiResource, kind);
    if (resource) {
      let links;
      if (name) {
        links = [
          {
            text: resource.kind,
            route: resource.route,
          },
          { text: name },
        ];
      } else {
        links = [{ text: resource.kind }];
      }
      return {
        ...resource,
        links,
      };
    }
    throw new Error(`没有查找到 kind 为 [${kind}] 的 Resource`);
  },

  deploymentKinds(state) {
    const { apiResource } = state;
    if (!apiResource) return [];
    return ['DeploymentConfig', 'Deployment']
      .map(kind => apiResource[kind])
      .filter(Boolean);
  },

  exposeKinds(state) {
    const { apiResource } = state;
    if (!apiResource) return [];
    return ['Ingress', 'Route'].map(kind => apiResource[kind]).filter(Boolean);
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

  // 初始化项目组视图，获取sso、配额、项目组的信息
  initTenantView({ dispatch, commit }) {
    commit(types.INIT_TENANT_VIEW_REQUEST);
    return Promise.all([
      dispatch('loadSSOInfo'),
      dispatch('loadQuotaField'),
      dispatch('initConsoleView'),
    ]).then(() => {
      commit(types.INIT_TENANT_VIEW_SUCCESS);
    }).catch(() => {
      commit(types.INIT_TENANT_VIEW_SUCCESS);
    });
  },

  initConsoleView({ dispatch, state }) {
    return dispatch('loadSpaces')
      .then(() => {
        return dispatch('loadZones');
      })
      .then(() => {
        return dispatch('getUserInfo');
      })
      .then(() => {
        if (state.zones.length) {
          return dispatch('initPortal');
        }
        return Promise.resolve();
      });
  },

  initView({ dispatch }) {
    dispatch('loadQuotaField');
    dispatch('loadSSOInfo');
  },

  loadQuotaField({ commit }) {
    QuotaService.listQuotaFields().then(res => {
      commit(types.LOAD_QUOTA_FIELD, res);
    });
  },

  loadSSOInfo({ commit }) {
    SSOService.getIdentityProvider().then(providers => {
      const ssoInfo = first(providers) || {};
      const login_url = getValue(ssoInfo, 'login_url');
      const logout_url = getValue(ssoInfo, 'logout_url');
      commit(types.SET_SGM_SSO, ssoInfo);
      commit(types.SET_SGM_LOGIN_URL, login_url);
      commit(types.SET_SGM_LOGOUT_URL, logout_url);
    });
  },

  loadSpaces({ commit, state, getters }) {
    return new Promise((resolve, reject) => {
      Promise.all([
        OrgService.getUserOrgs(),
        SpaceService.getUserSpaces(),
      ]).then(([orgs, spaces]) => {
        // 如果没有可以进入的租户，则跳转页面，onInitTenantView设为true防止循环调用
        if (isEmpty(orgs)) {
          if (state.user.service_role === 'service_admin') {
            router.push({ name: 'console.platform-approval', query: { onInitTenantView: true } });
          } else {
            Vue.noty.error(`您暂未加入任何${getters.orgDescription}及${getters.spaceDescription}`);
            router.push({ name: 'console.profile', query: { onInitTenantView: true } });
          }
          reject(new Error('no orgs'));
          return;
        }

        // 过滤没有项目组的租户，设为 disabled，保存 orgs 和 spaces 到 vuex
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

        // 获取上次登录的租户
        let org = OrgService.getLocalOrg();
        if (org && org.id) {
          org = orgs.find(x => x.id === org.id);
        }

        // 如果没有上次登录的租户，或者id在orgs找不到，则选择第一个有项目组的租户
        if (!org || !org.id) {
          org = first(orgs);
        }

        if (org) {
          commit(types.SWITCH_ORG, { org });
          OrgService.setLocalOrg(org);
        } else {
          // 如果org为空，也就是org没有space，则跳转到profile页面，onInitTenantView设为true防止循环调用
          Vue.noty.error(`您暂未加入任何${getters.spaceDescription}`);
          router.push({ name: 'console.profile', query: { onInitTenantView: true } });
          reject(new Error('no space'));
          return;
        }

        // 选择项目组
        // 获取上次登录的项目组
        let space = SpaceService.getLocalSpace();
        if (space && space.id) {
          space = spaces.find(x => x.id === space.id && x.organization_id === org.id);
        }

        // 如果没有上次登录的项目组，或者id在spaces中找不到，或者space不在当前的org中，则获取当前org中的第一个项目组
        if (!space || !space.id) {
          space = first(org.children);
        }

        if (space) {
          SpaceService.setLocalSpace(space);
          commit(types.SWITCH_SPACE, { space });
        } else {
          // 不会出现，以防万一
          Vue.noty.error('出错了');
          router.push({ name: 'console.profile', query: { onInitTenantView: true } });
          reject(new Error('no space'));
          return;
        }
        resolve();
      });
    });
  },

  loadZones({ commit, state }) {
    return SpaceService.getSpaceZones(state.space.id).then(zones => {
      commit(types.LOAD_ZONE_SUCCESS, { zones });

      // get localStorage saved zone;
      let zone = ZoneService.getLocalZone();

      if (zone && zone.id) {
        // in case localStorage tenant info is expired.
        zone = zones.find(x => x.id === zone.id);
      }

      if (!zone || !Object.keys(zone).length) {
        zone = first(zones) || {};
      }
      ZoneService.setLocalZone(zone);

      commit(types.SWITCH_ZONE, { zone });
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

  initPortal({ dispatch, commit }) {
    Promise.all([
      dispatch('loadBrokerService'),
      dispatch('loadAPIResource'),
    ]).then(() => {
      commit(types.INIT_TENANT_VIEW_SUCCESS);
    });
  },

  loadBrokerService({ commit, state, dispatch }) {
    return SpaceService.listBrokerServices(state.space.id, {
      zoneId: state.zone.id,
    }).then(services => {
      const { broker_services } = services;
      broker_services.forEach(bs => {
        bs.route = getListPath(bs);
      });
      dispatch('loadCategory');
      commit(types.LOAD_SERVICE_SUCCESS, broker_services);
    });
  },

  loadAPIResource({ commit, state }) {
    return APIResourceService.list(state.zone).then(resources => {
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

      filteredResourceList.sort((a, b) => {
        return (
          DEFAULT_RESOURCE.indexOf(a.kind) - DEFAULT_RESOURCE.indexOf(b.kind)
        );
      });

      const resourceMap = {};
      filteredResourceList.forEach(resource => {
        resourceMap[resource.kind] = {
          ...resource,
          route: {
            name: `resource.${resource.name}.list`,
          },
          icon: `#icon_${resource.name}`,
          logo: `#icon_${resource.name}-logo`,
        };
      });

      commit(types.LOAD_API_RESOURCE, resourceMap);
    });
  },

  loadCategory({ commit }) {
    CatalogService.getSchema().then(res => {
      commit(types.LOAD_CATEGORY, res);
    });
  },

  loadSystemSettings({ commit }) {
    return SystemService.getSystemSettings().then(param => {
      commit(types.LOAD_SYSTEM_SETTINGS_SUCCESS, { param });
    });
  },

  switchOrg({ dispatch, commit }, { org, space }) {
    commit(types.SWITCH_ORG, { org });
    OrgService.setLocalOrg(org);
    dispatch('switchSpace', { space });
  },

  // 切换项目组
  switchSpace({ dispatch, commit }, { space }) {
    commit(types.SWITCH_SPACE, { space });
    SpaceService.setLocalSpace(space);

    dispatch('loadZones').then(() => {
      if (state.zones.length) {
        const zone = first(state.zones);
        dispatch('switchZone', { zone });
        router.push({
          name: 'console.dashboard',
        });
      } else {
        Vue.noty.error('暂无可用区');
      }
    });
  },

  // 切换可用区
  switchZone({ dispatch, commit }, { zone }) {
    commit(types.SWITCH_ZONE, { zone });
    ZoneService.setLocalZone(zone);
    dispatch('getUserInfo').then(() => {
      dispatch('initPortal');
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
  [types.ALARM_LIST_VIEW_REQUEST](state) {
    state.loadings = { ...state.loadings, alarmListView: true };
  },

  [types.ALARM_LIST_VIEW_SUCCESS](state) {
    state.loadings = { ...state.loadings, alarmListView: false };
  },

  [types.ALARM_RULES](state, rules) {
    state.alarm.rules = rules.map(rule => pick(rule, ['name', 'id']));
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

  [types.UPDATE_OPENED_MENUS](state, openedMenus) {
    state.openedMenus = openedMenus;
  },
};
/* eslint-enable no-shadow */
