import isNamespaceName from '@/core/utils/is-namespace-name';

export default {
  getMessage() {
    return 'must be 1-19 alpha, number';
  },
  i18n: {
    zh_CN() {
      return "名称必须由小写字母、数字或 '-' 组成，不能以 '-' 和数字开头, 且不能以 '-' 结尾";
    },
  },
  validate(name) {
    return isNamespaceName(name);
  },
};
