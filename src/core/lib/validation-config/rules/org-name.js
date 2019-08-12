export default {
  getMessage() {
    return 'must be 1-20';
  },
  i18n: {
    zh_CN() {
      return '必须1~20位，任意字符。';
    },
  },
  validate(name) {
    return /^.{1,20}$/.test(name);
  },
};
