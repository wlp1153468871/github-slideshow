import { ENV_SOURCE } from '@/core/constants/constants';

const dict = {
  [ENV_SOURCE.CONFIG]: 'Config Map',
  [ENV_SOURCE.CONFIG_FILE]: 'Config Map',
  [ENV_SOURCE.SECRET]: 'Secret',
  [ENV_SOURCE.SECRET_FILE]: 'Secret',
};
export default function configFileFilter(type) {
  return dict[type];
}
