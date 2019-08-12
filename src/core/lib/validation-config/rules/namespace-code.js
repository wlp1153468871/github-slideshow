import isNamespaceName from '@/core/utils/is-namespace-name';

export default {
  getMessage() {
    return 'must be 1-19 alpha, number';
  },
  i18n: {
    zh_CN() {
      return '名称必须由小写字母、数字或 - 组成，且只能以数字或字母开头结尾';
    },
  },
  validate(name) {
    return isNamespaceName(name);
  },
};
