import api from './api';

class UtilService {
  constructor() {
    this.api = api;
  }

  /**
   * get image tag info
   * @param organization
   * @param {String} zone
   * @param {String} image image url
   * @param {String} tagFilter idk
   * @param {String} username username for private image
   * @param {String} password password for private image
   * @param {String} verifySSL verifySSL for private image
   */
  getDockerImageTags(organization, zone, image, username, password, verifySSL, tagFilter) {
    const query = { organization, zone };
    return this.api.post(
      '/image-tags',
      {
        image,
        tag_filter: tagFilter,
        username,
        password,
        verify_ssl: verifySSL,
      },
      {
        params: query,
      },
    );
  }
}

export default new UtilService();
