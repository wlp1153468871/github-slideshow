export default {
  getMessage() {
    return 'is not different';
  },
  i18n: {
    zh_CN() {
      return '新密码不能和旧密码相同';
    },
  },
  validate(value, args) {
    const [pwd] = args;
    return value !== pwd;
  },
};
