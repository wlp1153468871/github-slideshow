import { AppPictureModel } from './app-picture.model';

export class ThemeModel {
  productName: string;
  appPicture: AppPictureModel;

  constructor(productName?: string, appPicture?: AppPictureModel) {
    this.productName = productName || '';
    this.appPicture = appPicture || new AppPictureModel();
  }
}
