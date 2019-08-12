export class AppPictureModel {
  favicon: string;
  loginPicture: string;
  navPicture: string;
  constructor(loginPicture?: string, navPicture?: string, favicon?: string) {
    this.loginPicture = loginPicture || '';
    this.navPicture = navPicture || '';
    this.favicon = favicon || '';
  }
}
