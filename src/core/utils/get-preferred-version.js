import { API_PREFERRED_VERSIONS } from '@/core/constants/resource';

export default function getPreferredVersion(resource) {
  const preferred = API_PREFERRED_VERSIONS[resource];
  if (!preferred) {
    console.log('No preferred version for ', resource);
  }
  return preferred;
}
