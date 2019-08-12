import { isEmpty } from 'lodash';

export default function imageObjectRef(
  objectRef,
  nsIfUnspecified,
  shortOutput,
) {
  if (!objectRef) {
    return '';
  }

  let ns = objectRef.namespace || nsIfUnspecified || '';
  if (!isEmpty(ns)) {
    ns += '/';
  }
  const { kind } = objectRef;
  if (kind === 'ImageStreamTag' || kind === 'ImageStreamImage') {
    return ns + objectRef.name;
  }
  if (kind === 'DockerImage') {
    let { name } = objectRef;
    if (shortOutput) {
      name = name.substring(name.lastIndexOf('/') + 1);
    }
    return name;
  }
  return ns + objectRef.name;
}
