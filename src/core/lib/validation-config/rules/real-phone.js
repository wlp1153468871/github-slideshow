import isPhone from '@/core/utils/is-phone';

export default {
  getMessage() {
    return 'must be 11 number or machine number';
  },
  i18n: {
    zh_CN() {
      return '必须是11位数手机号';
    },
  },
  validate(phone) {
    return isPhone(phone);
  },
};
