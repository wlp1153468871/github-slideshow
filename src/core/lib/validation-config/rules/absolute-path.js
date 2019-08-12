export default {
  getMessage() {
    return 'Path must start with <code>/</code>';
  },
  i18n: {
    zh_CN() {
      return "路径必须以 '/' 开头";
    },
  },
  validate(path) {
    return /^\/.*$/.test(path);
  },
};
