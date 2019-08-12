import swal from 'sweetalert';

function plugin(Vue) {
  Vue.prototype.$tada = swal;
  Vue.prototype.$tada.success = function success(title, text = '') {
    return swal({
      title,
      text,
      icon: 'success',
      button: '确认',
    });
  };
  Vue.prototype.$tada.error = function error(title, text = '') {
    if (typeof text === 'object') {
      text = JSON.stringify(text);
    }
    return swal({
      title,
      text,
      icon: 'error',
      button: '确认',
    });
  };
  Vue.prototype.$tada.confirm = function danger(config) {
    const {
      title,
      text,
      // primaryLevel: 'success',
      primaryText = '删除',
      dangerMode = true, // 默认true是为了和以前的config兼容
    } = config;
    return swal({
      title,
      text,
      icon: 'warning',
      closeOnClickOutside: false,
      buttons: ['取消', primaryText],
      dangerMode,
    });
  };
}

// Install by default if using the script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}

export default plugin;
