import yaml from 'js-yaml';

export default function install(Vue) {
  Vue.prototype.$jsyaml = yaml;
}

export { yaml };
