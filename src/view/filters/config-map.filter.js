import { ENV_SOURCE } from '@/core/constants/constants';

const dict = {
  [ENV_SOURCE.CONFIG]: 'Config Map',
  [ENV_SOURCE.SECRET]: 'Secret',
  [ENV_SOURCE.CONFIG_FILE]: 'Config Map',
  [ENV_SOURCE.SECRET_FILE]: 'Secret',
};
export default function configMapFilter({ type, name, value }) {
  try {
    if (type === ENV_SOURCE.DEFAULT) {
      return value;
    } else if ([ENV_SOURCE.CONFIG, ENV_SOURCE.SECRET].indexOf(type) > -1) {
      return `${dict[type]}: ${value.name}, 键: ${value.value}`;
    } else if (
      [ENV_SOURCE.CONFIG_FILE, ENV_SOURCE.SECRET_FILE].indexOf(type) > -1
    ) {
      return `${name}(${dict[type]})`;
    }
  } catch (e) {
    return '异常';
  }
  return '异常';
}
