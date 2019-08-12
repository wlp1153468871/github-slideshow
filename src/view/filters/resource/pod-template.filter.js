import { get } from 'lodash';

export default function podTemplate(apiObject) {
  if (!apiObject) {
    return null;
  }

  if (apiObject.kind === 'Pod') {
    return apiObject;
  }

  return get(apiObject, 'spec.template');
}
