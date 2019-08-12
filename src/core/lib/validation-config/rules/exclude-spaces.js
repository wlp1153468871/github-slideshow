import containSpaces from '@/core/utils/contain-spaces';

export default {
  getMessage() {
    return 'Can not contain spaces!';
  },
  i18n: {
    zh_CN() {
      return '不能存在空格';
    },
  },
  validate(name) {
    return !containSpaces(name);
  },
};
