import isUrl from '@/core/utils/is-url';

export default {
  getMessage() {
    return 'is not a valid URL';
  },
  i18n: {
    zh_CN() {
      return '不是有效的 URL';
    },
  },
  validate(val) {
    return isUrl(val);
  },
};
