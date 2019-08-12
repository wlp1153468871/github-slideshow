import isChinese from '@/core/utils/is-chinese';

export default {
  getMessage() {
    return 'can not contain Chinese';
  },
  i18n: {
    zh_CN() {
      return '不能存在汉字';
    },
  },
  validate(name) {
    return !isChinese(name);
  },
};
