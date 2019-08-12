import isLegacyName from '@/core/utils/is-legacy-name';

export default {
  getMessage() {
    return 'must be 6-26 alpha, number or undersc';
  },
  i18n: {
    zh_CN() {
      return '必须6~26位的英文，数字，下划线';
    },
  },
  validate(name) {
    return isLegacyName(name);
  },
};
