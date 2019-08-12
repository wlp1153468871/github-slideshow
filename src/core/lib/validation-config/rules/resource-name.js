import { DNS1123_SUBDOMAIN_VALIDATION } from '@/core/constants/resource';

export default {
  getMessage() {
    return DNS1123_SUBDOMAIN_VALIDATION.description;
  },
  i18n: {
    zh_CN() {
      return DNS1123_SUBDOMAIN_VALIDATION.chinese;
    },
  },
  validate(name) {
    return DNS1123_SUBDOMAIN_VALIDATION.pattern.test(name);
  },
};
