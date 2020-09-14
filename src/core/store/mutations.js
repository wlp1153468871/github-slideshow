/* eslint-disable function-paren-newline */
/* eslint-disable object-curly-newline */
import Vue from 'vue';
import QuotaService from '@/core/services/quota.service';
import SSOService from '@/core/services/sso.service';
import RoleService from '@/core/services/role.service';
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
import { DEFAULT_RESOURCE, mergeDefaultHelpUrls } from '@/core/constants/resource';
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
  ssoList: [],
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
  isFullscreened: false,
  localLogin: true,
  zoneRole: {},
  zonePages: [],
  zoneAction: [],
  zonePermission: {},
  spaceRole: {},
  spacePages: [],
  spaceAction: [],
  spacePermission: {},
  orgRole: {},
  orgPages: [],
  orgAction: [],
  orgPermission: {},
  platformRole: {},
  platformPages: [],
  platformAction: [],
  platformPermission: {},
  isManageView: false,
};

function flat(
  tree = [],
  result = {
    pages: [],
    actions: [],
  },
) {
  tree.forEach(({ featureCode, type, children, access }) => {
    if ((type === 'page' || type === 'feature' || type === 'root') && access) {
      result.pages.push(featureCode);
    }
    // result.actions[featureCode] = access;
    if (children) {
      children.forEach(action => {
        if ((action.type === 'page' || action.type === 'feature') && action.access) {
          result.actions.push(action.featureCode);
          // if (result.actions[featureCode]) {
          //   result.actions[featureCode].push(action.featureCode);
          // } else {
          //   result.actions[featureCode] = [action.featureCode];
          // }
        }
      });
      flat(children, result);
    }
  });
  return result;
}

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

  isPlatformAdmin(state, getters) {
    return getters.pages.some(m => m === 'platform-root');
  },

  isOrganizationAdmin(state, getters) {
    return getters.pages.some(m => m === 'organization-root');
  },

  isSpaceAdmin(state, getters) {
    return getters.pages.some(m => m === 'space.manage');
  },

  zoneUnauthorized(state, getters) {
    return getters.pages.indexOf('serviceBroker') === -1;
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

  userId(state) {
    return state.user.id;
  },

  userName(state) {
    return state.user.username;
  },

  orgSpaces(state) {
    if (!state.org || !state.org.id) return [];
    return state.spaces.filter(x => x.organization_id === state.org.id);
  },

  zoneId(state) {
    return state.zone.id;
  },

  zoneScope(state) {
    return `zone.${state.zone.type}`;
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

  getResourceForHeader: state => (kind, name) => {
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
    return ['DeploymentConfig', 'Deployment'].map(kind => apiResource[kind]).filter(Boolean);
  },

  exposeKinds(state) {
    const { apiResource } = state;
    if (!apiResource) return [];
    return ['Ingress', 'Route'].map(kind => apiResource[kind]).filter(Boolean);
  },

  actions(state) {
    const { zoneAction, spaceAction, orgAction, platformAction } = state;
    return [...zoneAction, ...spaceAction, ...orgAction, ...platformAction];
  },

  pages(state) {
    const { zonePages, spacePages, orgPages, platformPages } = state;
    return [...zonePages, ...spacePages, ...orgPages, ...platformPages];
  },
};

export const actions = {
  async getPermissionById({ commit }, { role, params }) {
    const { id, scope } = role;
    const data = await RoleService.getPermission(id, params);
    if (scope === 'space') {
      commit('setSpaceRole', { data, role });
    } else if (scope.includes('zone')) {
      commit('setZoneRole', { data, role });
    } else if (scope === 'organization') {
      commit('setOrgRole', { data, role });
    } else if (scope === 'platform') {
      commit('setPlatformRole', { data, role });
    }
    return Promise.resolve();
  },
  loadPlatformRole({ dispatch }) {
    return dispatch('loadRole', {
      scope: 'platform',
      platformId: 'dsp',
    });
  },
  loadOrgRole({ dispatch, getters }) {
    return dispatch('loadRole', {
      scope: 'organization',
      organizationId: getters.orgId,
    });
  },
  loadSpaceRole({ dispatch, getters }) {
    return dispatch('loadRole', { scope: 'space', spaceId: getters.spaceId });
  },
  loadZoneRole({ dispatch, getters }) {
    if (getters.zoneId) {
      return dispatch('loadRole', {
        // scope: state.zone.name && state.zone.name.includes('k8s') ? 'zone.k8s' : 'zone.ocp',
        scope: getters.zoneScope,
        spaceId: getters.spaceId,
        zoneId: getters.zoneId,
      });
    }
    return null;
  },
  // 获取指定用户角色，使用返回的可以用区id和项目组id 分别请获取这两个角色权限详情
  loadRole({ getters, dispatch, commit }, params) {
    return RoleService.getRolesById(params, getters.userId).then(roleList => {
      const { scope } = params;
      if (roleList.length === 0) {
        if (scope === 'space') {
          commit('setSpaceRole', {});
        } else if (scope === 'organization') {
          commit('setOrgRole', {});
        } else if (scope === 'platform') {
          commit('setPlatformRole', {});
        } else {
          commit('setZoneRole', {});
        }
        return null;
        // return Promise.resolve();
      }
      const role = roleList[0];
      if (scope === 'space') {
        return dispatch('getPermissionById', {
          role,
          params: {
            spaceId: getters.spaceId,
          },
        });
      } else if (scope === 'organization') {
        return dispatch('getPermissionById', {
          role,
          params: {
            organizationId: getters.orgId,
          },
        });
      }
      return dispatch('getPermissionById', {
        role,
        params: null,
      });
    });
  },

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
    return AuthService.logout().then(({ logout_url: url }) => {
      dispatch('clearCache', url);
    });
  },

  clearCache({ commit }, url) {
    return new Promise(resolve => {
      if (url) window.open(url, '_self');
      commit(types.RESET_APPLICATION);
      resolve(router);
    });
  },

  // 初始化项目组视图，获取sso、配额、项目组的信息
  initTenantView({ dispatch, commit }) {
    commit(types.INIT_TENANT_VIEW_REQUEST);
    return dispatch('initConsoleView')
      .then(() => {
        commit(types.INIT_TENANT_VIEW_SUCCESS);
      })
      .catch(() => {
        commit(types.INIT_TENANT_VIEW_SUCCESS);
      });
  },

  initConsoleView({ dispatch }) {
    return dispatch('loadOrgsAndSpaces')
      .then(() => {
        return Promise.all([dispatch('loadSpaceRole'), dispatch('loadOrgRole')]);
      })
      .then(() => {
        return dispatch('loadZones');
      })
      .then(() => {
        return dispatch('loadZoneRole');
      })
      .then(() => {
        return dispatch('initPortal');
      });
  },

  // initView({ dispatch }) {
  //   dispatch('loadQuotaField');
  // },

  loadQuotaField({ commit }) {
    QuotaService.listQuotaFields().then(res => {
      commit(types.LOAD_QUOTA_FIELD, res);
    });
  },

  loadSSOInfo({ commit }) {
    Promise.all([SSOService.getIdentityProvider(), SSOService.getSSO()]).then(
      ([providers, localData]) => {
        commit(types.SET_SSO_LIST, providers);
        commit(types.SET_LOCAL_LOGIN, localData.enable_local_login);
      },
    );
  },

  loadOrgsAndSpaces({ commit, state, getters }) {
    return new Promise((resolve, reject) => {
      Promise.all([OrgService.getUserOrgs(), SpaceService.getUserSpaces()]).then(
        ([orgs, spaces]) => {
          // 如果没有可以进入的租户，则跳转页面，onInitTenantView设为true防止循环调用
          if (isEmpty(orgs)) {
            if (state.user.service_role === 'service_admin') {
              router.push({ name: 'console.platform-approval', query: { onInitTenantView: true } });
            } else {
              Vue.noty.error(
                `您暂未加入任何${getters.orgDescription}及${getters.spaceDescription}`,
              );
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
          } else {
            // 如果org为空，也就是org没有space，则跳转到profile页面，onInitTenantView设为true防止循环调用
            Vue.noty.error(`您暂未加入任何${getters.orgDescription}`);
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
            commit(types.SWITCH_SPACE, { space });
          } else {
            // 不会出现，以防万一
            Vue.noty.error('出错了');
            router.push({ name: 'console.profile', query: { onInitTenantView: true } });
            reject(new Error('no space'));
            return;
          }
          resolve();
        },
      );
    });
  },

  async loadZones({ commit, state }) {
    const zones = await SpaceService.getSpaceZones(state.space.id);
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
    commit(types.SWITCH_ZONE, { zone });
  },

  getUserInfo({ commit, dispatch }) {
    return AuthService.getUserInfo().then(user => {
      commit('LOAD_USER_SUCCESS', { user });
      return dispatch('loadPlatformRole');
    });
  },

  initPortal({ dispatch, commit, getters }) {
    if (getters.pages.some(a => a === 'k8s-root' || a === 'ocp-root' || a === 'dce-root')) {
      return Promise.all([dispatch('loadBrokerService'), dispatch('loadAPIResource')]).then(() => {
        commit(types.INIT_TENANT_VIEW_SUCCESS);
      });
    }
    return Promise.resolve();
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
    return APIResourceService.list(state.zone, state.space.id).then(resources => {
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
        return DEFAULT_RESOURCE.indexOf(a.kind) - DEFAULT_RESOURCE.indexOf(b.kind);
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

    return dispatch('loadOrgRole').then(() => {
      return dispatch('switchSpace', { space });
    });
  },

  // 切换项目组
  switchSpace({ dispatch, commit }, { space }) {
    commit(types.SWITCH_SPACE, { space });
    return dispatch('loadSpaceRole')
      .then(() => {
        return dispatch('loadZones');
      })
      .then(() => {
        return dispatch('loadZoneRole');
      })
      .then(() => {
        return dispatch('initPortal');
      })
      .then(() => {
        router.push({
          name: 'console.gateway',
          query: {
            t: new Date().getTime(),
          },
        });
      });
  },

  // 切换可用区
  switchZone({ dispatch, commit }, { zone }) {
    commit(types.SWITCH_ZONE, { zone });
    return dispatch('loadZoneRole').then(() => {
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

  [types.SET_LOCAL_LOGIN](state, data) {
    state.localLogin = data;
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
    ZoneService.setLocalZone(zone);
    state.zone = zone;
  },

  [types.SWITCH_ORG](state, { org }) {
    OrgService.setLocalOrg(org);
    state.org = org;
  },

  [types.SWITCH_SPACE](state, { space }) {
    SpaceService.setLocalSpace(space);
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

  [types.SET_SSO_LIST](state, sso) {
    state.ssoList = sso;
  },

  [types.LOAD_API_RESOURCE](state, resourceMap) {
    state.apiResource = resourceMap;
  },

  [types.UPDATE_OPENED_MENUS](state, openedMenus) {
    state.openedMenus = openedMenus;
  },

  [types.FUll_SCREENED](state, isFullscreened) {
    state.isFullscreened = isFullscreened;
  },
  setZoneRole(state, { data, role }) {
    state.zoneRole = role;
    state.zonePermission = data;
    const { pages, actions } = flat([data || {}]);
    state.zonePages = pages;
    state.zoneAction = actions;
  },
  setSpaceRole(state, { data, role }) {
    state.spaceRole = role;
    state.spacePermission = data;
    const { pages, actions } = flat([data || {}]);
    state.spacePages = pages;
    state.spaceAction = actions;
  },
  setOrgRole(state, { data, role }) {
    state.orgRole = role;
    state.orgPermission = data;
    const { pages, actions } = flat([data || {}]);
    state.orgPages = pages;
    state.orgAction = actions;
  },
  setPlatformRole(state, { data, role }) {
    state.platformRole = role;
    state.platformPermission = data;
    const { pages, actions } = flat([data || {}]);
    state.platformPages = pages;
    state.platformAction = actions;
  },

  setManageView(state, status) {
    state.isManageView = status;
  },
};
/* eslint-enable no-shadow */
