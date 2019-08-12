function plugin(Vue) {
  Vue.prototype.$daoDialog = function daoDialogTrigger(vm) {
    return new Promise((resolve, reject) => {
      vm.$once('__resolve', resolve);
      vm.$once('__reject', reject);
    });
  };
}

// Install by default if using the script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}

export default plugin;
