import isBase64 from '@/core/utils/is-base64';

export default {
  getMessage() {
    return 'Must be base64 string';
  },
  i18n: {
    zh_CN() {
      return '不符合base64规范';
    },
  },
  validate(name) {
    return isBase64(name);
  },
};
