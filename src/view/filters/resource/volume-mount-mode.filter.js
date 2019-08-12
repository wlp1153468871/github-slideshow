import { get, find, has } from 'lodash';

const isConfigVolume = volume => {
  return has(volume, 'configMap') || has(volume, 'secret');
};

export default function volumeMountModeFilter(mount, volumes) {
  if (!mount) {
    return '';
  }

  // Config maps and secrets are always read-only, even if not explicitly
  // set in the volume mount.
  const volume = find(volumes, { name: mount.name });
  if (isConfigVolume(volume)) {
    return 'read-only';
  }

  if (get(volume, 'persistentVolumeClaim.readOnly')) {
    return 'read-only';
  }

  return mount.readOnly ? 'read-only' : 'read-write';
}
