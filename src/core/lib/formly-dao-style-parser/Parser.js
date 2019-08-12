import { first } from 'lodash';
import BrokerConfig from './Config';

const TYPE = {
  STRING: 'string',
  INTEGER: 'integer',
  BOOLEAN: 'boolean',
  ONEOF: 'oneOf',
  ANYOF: 'anyOf',
};

export default class Parser {
  static toFormly(configs) {
    if (!Array.isArray(configs)) {
      console.error('configs should be array...');
      return configs;
    }

    return configs.map(config =>
      new BrokerConfig(config).toConfig());
  }

  static getModel(configs) {
    if (!Array.isArray(configs)) {
      console.error('the config would be Array');
    }

    return configs.reduce((model, config) => {
      model[config.id] = Parser.getDefaultValue(config);
      return model;
    }, {});
  }

  static getDefaultValue(config) {
    const { type } = config;
    if (config.default) {
      if (type === TYPE.ANYOF && typeof config.default === 'string') {
        return [config.default];
      }
      return config.default;
    }
    if (type === TYPE.INTEGER) {
      return 0;
    } else if (type === TYPE.BOOLEAN) {
      return false;
    } else if (type === TYPE.ONEOF) {
      const { value = '' } = first(config.options) || {};
      return value;
    } else if (type === TYPE.ANYOF) {
      return [];
    }
    return '';
  }

  static toKV(keList) {
    keList.map(kv => {
      const [k, v] = kv;
      return `${k}=${Parser.stringify(v)}`;
    });
  }

  static stringify(value) {
    if (value === null || value === undefined) {
      return '';
    } else if (Array.isArray(value)) {
      return value.join(',');
    }
    return value;
  }
}
