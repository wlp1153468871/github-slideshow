export const APP_CONFIG_TYPE = {
  IMAGE: '版本',
  LB: '负载均衡',
  ENVS: '环境配置',
  MOUNT_FILE: '挂载 Config Map',
  CMD: '启动方式',
  VOLUME: '存储卷',
};

export const BLUEGREEN_DEPLOYMENT = 'blue-green-release';

export const GRAY_DEPLOYMENT = 'gray-release';

export const DEPLOYMENT_TYPE = {
  DEFAULT: '',
  GRAY: GRAY_DEPLOYMENT,
  BLUEGREEN: BLUEGREEN_DEPLOYMENT,
};

export const BUILDIN_SERVICE_TOKEN_NAME = {
  DCS_DEPLOY_TOKEN: 'dcs_deploy_app_token',
};
