import Vue from 'vue';
import { isObject } from 'lodash';
import { LS_KYES } from '@/core/constants/constants';
import Storage from '@/core/lib/storage';

/**
 * all localStorage/sessionStorage operatino in this service.
 * @private private class using in auth.service
 * @kind cache.service
 */
class StorageCache {
  constructor() {
    this.store = Storage.getLocalStorage();
  }

  clear() {
    this.store.clear();
  }

  // user
  saveUser(user) {
    this.store.set(LS_KYES.USER, user);
  }

  getUser() {
    return this.store.get(LS_KYES.USER);
  }

  // set token with Vue.ls
  saveToken(token) {
    Vue.ls.set(LS_KYES.TOKEN, token, 7 * 24 * 60 * 60 * 1000);
  }

  getToken() {
    return Vue.ls.get(LS_KYES.TOKEN);
  }

  removeToken() {
    Vue.ls.remove(LS_KYES.TOKEN);
  }

  // org
  setOrg(org) {
    this.store.set(LS_KYES.ORG, org);
  }

  getOrg() {
    let org = this.store.get(LS_KYES.ORG);
    if (!isObject(org)) {
      org = null;
    }
    return org;
  }

  // space
  setSpace(space) {
    this.store.set(LS_KYES.SPACE, space);
  }

  getSpace() {
    let space = this.store.get(LS_KYES.SPACE);
    if (!isObject(space)) {
      space = null;
    }
    return space;
  }

  // zone

  saveZone(zone) {
    this.store.set(LS_KYES.ZONE, zone);
  }

  getZone() {
    return this.store.get(LS_KYES.ZONE);
  }

  // set token with Vue.ls
  saveIdToken(token) {
    Vue.ls.set(LS_KYES.TOKEN, token, 7 * 24 * 60 * 60 * 1000);
  }

  // dx token
  getIdToken() {
    return Vue.ls.get(LS_KYES.IDTOKEN);
  }

  removeIdToken() {
    Vue.ls.remove(LS_KYES.IDTOKEN);
  }
}

export default new StorageCache();
