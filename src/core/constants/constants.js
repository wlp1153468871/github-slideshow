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

// 用户30分钟内无操作，退出登录
export const REFRESH_COUNT = 30 * 60;

export const POLL_INTERVAL = 3 * 1000;

export const INROUTER_KEY = 'inrouter';
