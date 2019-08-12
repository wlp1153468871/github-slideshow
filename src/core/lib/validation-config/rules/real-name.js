import isRealName from '@/core/utils/is-real-name';

export default {
  getMessage() {
    return 'must be 2-20 Chinese，English';
  },
  i18n: {
    zh_CN() {
      return '必须2~20位的中文，英文';
    },
  },
  validate(name) {
    return isRealName(name);
  },
};
