// approval process state
export const APPROVAL_PROCESS_DONE = 'process_done';
export const APPROVAL_PROCESS_ONDOING = 'process_ondoing';
export const APPROVAL_PROCESS_CANCEL = 'process_cancel';
export const APPROVAL_PROCESS_PENDING = 'process_pending';
export const APPROVAL_PROCESS_REJECTED = 'process_rejected';

export const APPROVAL_PROCESS_TYPES = {
  APPROVING: 'approving',
  PROCESS_PENDING: APPROVAL_PROCESS_PENDING,
  PROCESS_ONDOING: APPROVAL_PROCESS_ONDOING,
  PROCESS_DONE: APPROVAL_PROCESS_DONE,
  PROCESS_REJECTED: APPROVAL_PROCESS_REJECTED,
};

// approval-type
export const APPROVAL_TYPES = {
  // 任意一个管理员同意审批即通过
  PASS_TYPE_ANYOF: 'pass_type_anyof',

  // 所有管理员同意审批即通过
  PASS_TYPE_ALLOF: 'pass_type_allof',

  // 指定的租户成员同意审批, 不带顺序(with order)
  PASS_TYPE_SEQ: 'pass_type_seq',

  // 指定的租户成员同意审批, 不带顺序(without order)
  PASS_TYPE_CUSTOM: 'pass_type_custom',
};

// localStorage item keys
export const LS_KYES = {
  // 用户信息
  USER: 'SrvUser',
  // token 信息
  TOKEN: 'AuthToken',
  // 租户信息
  TENANT: 'USER_TENANT',
  // last select zone
  ZONE: 'SELECTED_ZONE',
  // last selected org
  ORG: 'SELECTED_ORG',
  // last selected space
  SPACE: 'SELECTED_SPACE',
};

export const INSTANCE_STATUS = {
  // CREATING_TEXT: '正在创建',
  CREATING: 'creating',

  // UPDATING_TEXT: '正在更新',
  UPDATING: 'updating',

  // DELETING_TEXT: '正在删除',
  DELETING: 'deleting',

  // APPROVING_TEXT: '正在审核中',
  APPROVING: 'approving',

  FAILED: 'failed',

  // CREATE_FAILED_TEXT: '创建失败',
  CREATE_FAILED: 'create_failed',

  // DELETE_FAILED_TEXT: '删除失败',
  DELETE_FAILED: 'delete_failed',

  // DELETE_FAILED_TEXT: '更新失败',
  UPDATE_FAILED: 'update_failed',

  PROCESS_REJECTED: 'process_rejected',

  STOPPED: 'stopped',

  RUNNING: 'running',

  UPDATE_SUCCESS: 'update_success',
  UPDATE_FAIL: 'update_fail',
  COMFIRM_FAIL: 'comfirm_fail',
  CONFIRM_SUCCESS: 'confirm_success',
  CANCEL_SUCCESS: 'cancel_success',
  CANCEL_FAIL: 'cancel_fail',

  CREATE_PROCESS_REJECTED: 'create_process_rejected',
};

export const CATALOG_STATUS = {
  AVAILABLE: 'available',
  UNINSTALL: 'uninstall',
  INSTALLUNAVAILABLE: 'installunavailable',
  UNKNOWN: 'unknown',
};

export const AUTOMATIC_SERVICE = 'automatic_service';
export const DEPLOYMENT_SERVICE = 'route';
export const VOLUME_SERVICE = 'volume';
export const SECRET = 'secret';
export const DCS = 'dcs';
export const ORG_LABEL = '租户';
export const SPACE_LABEL = '项目组';
export const ZONE_LABEL = '可用区';
export const ZONE_AREA_LABEL = '区域';
export const ZONE_ENV_LABEL = '环境';

export const AREA_ENV = `${ZONE_AREA_LABEL} / ${ZONE_ENV_LABEL}`;

export const SERVICE_TYPES_DESC = [
  {
    value: AUTOMATIC_SERVICE,
    text: '自动服务',
    desc: '使用系统默认的服务详情页面。',
    disabled: false,
  },
];

export const STATUS_COLOR = {
  SUCCESS: 'SUCCESS',
  DANGER: 'DANGER',
  CONTINUE: 'CONTINUE',
  STOPED: 'STOPED',
};

export const PLANKEY = {
  CONFIG: 'config',
  CPU: 'cpu',
  DISK: 'disk',
  GPU: 'gpu',
  HA: 'ha',
  MEMORY: 'memory',
  STORAGE: 'storage',
  SYMBOL: 'symbol',
};

export const DICTIONARY = {
  config: '计算资源',
};

// 集群连接测试的几种状态
export const TEST_STATUS = {
  UNTEST: 'untest',
  LOADING: 'loading',
  ACCESS: 'access',
  ERROR: 'error',
};

export const SYNC_STATUS = {
  UNSYNC: 'unsync',
  SYNCING: 'syncing',
  SYNCED: 'synced',
  SUCCESS: 'success',
  FAIL: 'failed',
};

// Config Map 类型
export const ENV_SOURCE = {
  DEFAULT: '',
  CONFIG: 'config',
  SECRET: 'secret',
  CONFIG_FILE: 'config_file',
  SECRET_FILE: 'secret_file',
};

// （加密） Config Map 的几个内容
export const CONFIG_TITLE_TYPE = {
  LABEL: '标签',
  DATA: '内容',
  ANNOTATIONS: '注解',
};

// 服务的几个状态
export const SERVICE_STATUS = {
  AVAILABLE: 'available',
  UNAVAILABLE: 'unavailable',
  BROKERDELETED: 'brokerdeleted',
};

export const LOCAL_ACCOUNT_KEY = 'local';

export const QUOTA_APPROVAL_STATUS = {
  START: 'start',
  FINISH: 'finish',
  REJECT: 'reject',
};

export const QUOTA_APPROVAL_LABEL = {
  [QUOTA_APPROVAL_STATUS.START]: '开始申请',
  [QUOTA_APPROVAL_STATUS.FINISH]: '通过申请',
  [QUOTA_APPROVAL_STATUS.REJECT]: '拒绝申请',
};
export const MONITOR_KIND = {
  DEPLOYMENT_CONFIG: 'Deployment Config',
  DEPLOYMENT: 'Deployment',
  STATEFUL_SET: 'Stateful Set',
};

// key: type in passing http
export const MONITOR_KIND_MAP = {
  Deployment: MONITOR_KIND.DEPLOYMENT,
  DeploymentConfig: MONITOR_KIND.DEPLOYMENT_CONFIG,
  StatefulSet: MONITOR_KIND.STATEFUL_SET,
};

export const MONITOR_KIND_MAP_FLIP = {
  [MONITOR_KIND.DEPLOYMENT]: 'Deployment',
  [MONITOR_KIND.DEPLOYMENT_CONFIG]: 'DeploymentConfig',
  [MONITOR_KIND.STATEFUL_SET]: 'StatefulSet',
};

export const MONITOR_TIME_MAP = {
  最近5分钟: ['now-5m', 'now'],
  最近15分钟: ['now-15m', 'now'],
  最近30分钟: ['now-30m', 'now'],
  最近1小时: ['now-1h', 'now'],
  最近3小时: ['now-3h', 'now'],
  最近6小时: ['now-6h', 'now'],
  最近12小时: ['now-12h', 'now'],
  最近24小时: ['now-24h', 'now'],
  今日: ['now/d', 'now/d'],
  最近2天: ['now-2d', 'now'],
  最近7天: ['now-7d', 'now'],
};

export const MONITOR_ALARM_TYPE = {
  APP: 'app',
  CONTAINTER: 'container',
  SERVICE: 'service',
};

export const MONITOR_ALL_PODS = '全部';

// 用户30分钟内无操作，退出登录
export const REFRESH_COUNT = 30 * 60;

export const POLL_INTERVAL = 3 * 1000;

export const INROUTER_KEY = 'inrouter';
