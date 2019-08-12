export default {
  getMessage() {
    return 'is not equal';
  },
  i18n: {
    zh_CN() {
      return '"确认密码"和"密码"不相同';
    },
  },
  validate(value, args) {
    const [pwd] = args;
    return value === pwd;
  },
};
