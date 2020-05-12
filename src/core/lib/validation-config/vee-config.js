import zh_CN from 'vee-validate/dist/locale/zh_CN'; // eslint-disable-line

export default function veeConfigFactory(config = {}) {
  return Object.assign(
    {
      errorBagName: 'veeErrors', // change if property conflicts
      fieldsBagName: 'veeFields',
      delay: 0,
      locale: 'zh_CN',
      dictionary: {
        zh_CN,
      },
      strict: true,
      classes: false,
      classNames: {
        touched: 'touched', // the control has been blurred
        untouched: 'untouched', // the control hasn't been blurred
        valid: 'valid', // model is valid
        invalid: 'invalid', // model is invalid
        pristine: 'pristine', // control has not been interacted with
        dirty: 'dirty', // control has been interacted with
      },
      events: 'input|blur',
      inject: true,
      validity: false,
      aria: true,
      i18n: null, // the vue-i18n plugin instance,
      i18nRootKey: 'validations', // the nested key under which the validation messsages will be located
    },
    config,
  );
}
