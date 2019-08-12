import ShellQuote from 'shell-quote';

export default {
  getMessage() {
    return 'this cmd/args not support';
  },
  i18n: {
    zh_CN() {
      return '暂不支持这种格式';
    },
  },
  validate(cmdStr) {
    const cmd = ShellQuote.parse(cmdStr) || [];
    return !cmd.find(n => n.op);
  },
};
