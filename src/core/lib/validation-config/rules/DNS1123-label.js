import { DNS1123_LABEL_VALIDATION } from '@/core/constants/resource';

export default {
  getMessage() {
    return DNS1123_LABEL_VALIDATION.description;
  },
  i18n: {
    zh_CN() {
      return DNS1123_LABEL_VALIDATION.chinese;
    },
  },
  validate(name) {
    return DNS1123_LABEL_VALIDATION.pattern.test(name);
  },
};
