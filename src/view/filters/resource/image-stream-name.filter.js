export default function imageStreamName(image) {
  if (!image) {
    return '';
  }
  // TODO move this parsing method into a utility method

  // remove @sha256:....
  const imageWithoutID = image.split('@')[0];

  const slashSplit = imageWithoutID.split('/');
  let semiColonSplit;
  if (slashSplit.length === 3) {
    semiColonSplit = slashSplit[2].split(':');
    return `${slashSplit[1]}/${semiColonSplit[0]}`;
  } else if (slashSplit.length === 2) {
    // TODO umm tough... this could be registry/imageName or imageRepo/imageName
    // have to check if the first bit matches a registry pattern, will handle this later...
    return imageWithoutID;
  } else if (slashSplit.length === 1) {
    semiColonSplit = imageWithoutID.split(':');
    return semiColonSplit[0];
  }

  return '';
}
