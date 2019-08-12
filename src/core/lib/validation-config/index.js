import { snakeCase, forEach } from 'lodash';
import { Validator } from 'vee-validate';

// vee-validate already inject build-in validators.
// http://vee-validate.logaretm.com/#available-rules
// defined custom validators
import base64 from './rules/base64';
import chinese from './rules/chinese';
import differentFrom from './rules/different-from';
import dns1123Label from './rules/DNS1123-label';
import dns1035Label from './rules/DNS1035-label';
import dns1123SubDomain from './rules/DNS1123-sub-domain';
import envVariablesName from './rules/env-variables-name';
import equalTo from './rules/equal-to';
import excludeSpaces from './rules/exclude-spaces';
import legacyName from './rules/legacy-name';
import NamespaceCode from './rules/k8-namepsace-code';
import namespaceCode from './rules/namespace-code';
import orgName from './rules/org-name';
import port from './rules/port';
import realName from './rules/real-name';
import realPhone from './rules/real-phone';
import resourceName from './rules/resource-name';
import absolutePath from './rules/absolute-path';
import shellQuota from './rules/shell-quota';
import url from './rules/url';
import { validate, options } from './rules/required-if-not-empty';

const dict = {
  name: 'zh_CN',
  messages: {}, // will inject validator's i18n[dict.name] function or object.
};

function $using(validators) {
  forEach(validators, (validator, name) => {
    const ruleName = snakeCase(name);
    if (validator.i18n && validator.i18n[dict.name]) {
      dict.messages[ruleName] = validator.i18n[dict.name];
      delete validator.i18n[dict.name];
    }
    Validator.extend(ruleName, validator);
  });
}

$using({
  absolutePath,
  base64,
  chinese,
  differentFrom,
  dns1123Label,
  dns1035Label,
  dns1123SubDomain,
  envVariablesName,
  equalTo,
  excludeSpaces,
  legacyName,
  NamespaceCode,
  namespaceCode,
  orgName,
  port,
  realName,
  realPhone,
  resourceName,
  shellQuota,
  url,
});

Validator.extend(snakeCase('requiredIfNotEmpty'), validate, options);

Validator.localize({ [dict.name]: dict });
