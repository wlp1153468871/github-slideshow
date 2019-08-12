import API, { APIService } from './api';
import { Base64 } from 'js-base64';
import { mapValues } from 'lodash';

class SecretService {
  api: APIService;

  constructor() {
    this.api = API;
  }

  async listSecret(spaceId: string, zone: string) {
    return this.api.get(`/spaces/${spaceId}/secrets`, { zone });
  }

  async getSecret(spaceId: string, zone: string, name: string) {
    return this.api.get(`/spaces/${spaceId}/secrets/${name}`, { zone });
  }

  async createSecret(spaceId: string, zone: string, secret: any) {
    return this.api.post(`/spaces/${spaceId}/secrets`, secret, {
      params: { zone },
    });
  }

  async updateSecret(spaceId: string, zone: string, name: string, secret: any) {
    return this.api.put(`/spaces/${spaceId}/secrets/${name}`, secret, {
      params: { zone },
    });
  }

  async deleteSecret(spaceId: string, zone: string, name: string) {
    return this.api.delete(`/spaces/${spaceId}/secrets/${name}`, { zone });
  }

  encodeSecret(secret: any) {
    const { data = {} } = secret;
    const encodedData = mapValues(data, x => Base64.encode(x));
    return {
      ...secret,
      data: encodedData,
    };
  }

  decodeSecret(secret: any) {
    const { data = {} } = secret;
    const decodedData = mapValues(data, x => Base64.decode(x));
    return {
      ...secret,
      data: decodedData,
    };
  }
}

export default new SecretService();
