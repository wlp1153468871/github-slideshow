export default function imageStreamName(image) {
  if (!image) {
    return '';
  }

  const imageWithoutID = image.split('@')[0];
  const slashSplit = imageWithoutID.split('/');

  // 此版本返回格式为 文件夹/镜像名
  // let semiColonSplit;
  // if (slashSplit.length === 3) {
  //   semiColonSplit = slashSplit[2].split(':');
  //   return `${slashSplit[1]}/${semiColonSplit[0]}`;
  // } else if (slashSplit.length === 2) {
  //   return imageWithoutID;
  // } else if (slashSplit.length === 1) {
  //   semiColonSplit = imageWithoutID.split(':');
  //   return semiColonSplit[0];
  // }

  // 当前版本只去掉域名，保留文件夹/镜像名/版本号
  // from peng.xie
  if (slashSplit.length === 3) {
    return `${slashSplit[1]}/${slashSplit[2]}`;
  }
  return imageWithoutID;
}
