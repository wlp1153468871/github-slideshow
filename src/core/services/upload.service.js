import AuthService from '@/core/services/auth.service';
import api from './api/';

class UploadService {
  constructor() {
    this.api = api;
  }

  get token() {
    return AuthService.getToken();
  }

  uploadPic(file) {
    return this.api
      .request({
        url: '/blobs',
        method: 'post',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': file.type,
        },
        data: file.file,
      })
      .then(res => {
        return `/v1/blobs/${res.id}`;
      });
  }
}

export default new UploadService();
