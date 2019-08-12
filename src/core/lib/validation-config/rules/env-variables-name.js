export default {
  getMessage() {
    return 'a valid environment variable name must consist of alphabetic characters, digits, "_", "-", or ".", and must not start with a digit';
  },
  i18n: {
    zh_CN() {
      return '由字母、数字、"_"、 "-" 或 "." 组成，并且不能以数字开头';
    },
  },
  validate(name) {
    return /^[-._a-zA-Z][-._a-zA-Z0-9]*$/.test(name);
  },
};
