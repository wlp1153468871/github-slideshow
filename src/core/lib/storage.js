/**
 * @private
 * @description 优化 localStorage 和 sessionStorage 的读写操作.
 */
class Storage {
  constructor(storage = window.localStorage) {
    this.storage = storage;
  }

  get(key) {
    let info = this.storage.getItem(key);
    try {
      info = JSON.parse(info);
    } catch (err) {
      /** do nothing */
    }
    return info;
  }

  set(key, value) {
    const valueStr = JSON.stringify(value);
    this.storage.setItem(key, valueStr);
  }

  remove(key) {
    this.storage.removeItem(key);
  }

  clear() {
    this.storage.clear();
  }
}

class StorageService {
  constructor() {
    this.localStorage = new Storage(window.localStorage);
    this.sessionStorage = new Storage(window.sessionStorage);
  }

  getLocalStorage() {
    return this.localStorage;
  }

  getSessionStorage() {
    return this.sessionStorage;
  }
}

export default new StorageService();
