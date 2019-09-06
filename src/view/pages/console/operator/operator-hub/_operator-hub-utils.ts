import { get } from 'lodash';

export const operatorProviderTypeMap = {
  redhat: 'Red Hat',
  certified: 'Certified',
  community: 'Community',
  custom: 'Custom',
};

export const getOperatorProviderType = (packageManifest: any) => {
  const srcProvider = get(packageManifest, 'metadata.labels.opsrc-provider');
  return get(operatorProviderTypeMap, srcProvider, 'Custom');
};
