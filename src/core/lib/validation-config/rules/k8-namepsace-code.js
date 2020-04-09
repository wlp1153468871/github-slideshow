import isNamespaceName from '@/core/utils/is-k8-namespace';

export default {
  getMessage() {
    return 'must be 1-19 alpha, number';
  },
  i18n: {
    zh_CN() {
      return '必须2~20位, 只能使用小写字母,数字和连字符, 且连字符不能在首尾';
    },
  },
  validate(name) {
    return isNamespaceName(name);
  },
};
