import isPort from '@/core/utils/is-port';

export default {
  getMessage() {
    return 'must valid port';
  },
  i18n: {
    zh_CN() {
      return '必须是1~65535之间的整数';
    },
  },
  validate(port) {
    return isPort(port);
  },
};
