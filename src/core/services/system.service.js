import setFavIcon from '@/core/utils/set-favicon';
import setDocumentTitle from '@/core/utils/set-document-title';
import api from './api/';

class SystemService {
  constructor() {
    this.api = api;
  }

  // 是否开启计费功能
  getSystemSettings() {
    return this.api.get('/settings/system');
  }

  updateSystemSettings(param) {
    return this.api.put('/settings/system', param);
  }

  getTheme() {
    return this.api.get('/settings/theme');
  }

  updateTheme(theme) {
    return this.api.put('/settings/theme', theme);
  }

  setDocumentTheme(theme) {
    const { appPicture = {}, productName } = theme;
    if (appPicture.favicon) {
      setFavIcon(appPicture.favicon);
    }
    if (productName) {
      setDocumentTitle(productName);
    }
  }
}

export default new SystemService();
