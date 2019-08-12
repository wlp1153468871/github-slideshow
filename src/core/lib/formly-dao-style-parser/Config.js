export default class BrokerConfig {
  constructor(config) {
    this.config = config;
    const { id, name, validators } = config;
    this.key = id;
    this.name = name;
    this.validators = validators;

    this.stategy = {
      select: this.getSelect.bind(this),
      integer: this.getInteger.bind(this),
      input: this.getInput.bind(this),
      switch: this.getSwitch.bind(this),
      radio: this.getRadio.bind(this),
      checkbox: this.getCheckbox.bind(this),
    };
  }

  toConfig() {
    const type = this.getType();
    const templateOptions = this.getTemplateOptions(type);
    const config = {
      key: this.key,
      type,
      templateOptions,
    };
    if (this.validators) {
      config.validators = this.validators;
    }
    return config;
  }

  getType() {
    let { type = 'input' } = this.config;
    if (type === 'oneOf' || type === 'anyOf') {
      const { sub_type = 'select' } = this.config;
      type = sub_type;
    } else if (type === 'string') {
      type = 'input';
    } else if (type === 'boolean') {
      type = 'switch';
    }
    return type;
  }

  getTemplateOptions(type) {
    const getter = this.stategy[type];
    let options = {};
    if (getter) {
      options = getter(type);
    } else {
      console.warn(`${type} does't have stategy!`);
    }
    return Object.assign({
      label: this.label,
      description: this.description,
      disabled: this.disabled,
    }, options);
  }

  getSelect() {
    const options = this.getOptions(this.config.options);
    return {
      options,
    };
  }

  getCheckbox() {
    const options = this.getOptions(this.config.options);
    return {
      options,
    };
  }

  getOptions(options = []) {
    return options.map(op => {
      const { name, value } = op;
      return {
        key: value,
        text: name,
        value,
      };
    });
  }

  getInteger() {
    const { min, max, unit } = this.config;
    return {
      min, max, unit,
    };
  }

  getSwitch() {
    const { on = '开启', off = '关闭' } = this.config;
    return {
      option: {
        on,
        off,
      },
    };
  }

  getInput() {
    return {

    };
  }

  getRadio() {
    const options = this.getOptions(this.config.options);
    return {
      options,
    };
  }

  get label() {
    return this.config.name;
  }

  get description() {
    return this.config.desc || '';
  }

  get disabled() {
    return !this.config.editable;
  }
}
