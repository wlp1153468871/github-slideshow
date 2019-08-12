export default {
  bind(el, binding) {
    const handle = e => {
      if (binding.arg) {
        const nodes = document.getElementsByClassName(binding.arg);
        for (let i = 0; i < nodes.length; i += 1) {
          if (nodes[i].contains(e.target)) {
            return false;
          }
        }
      }

      if (el.contains(e.target)) {
        return false;
      }

      if (binding.expression) {
        return binding.value(e);
      }
      return false;
    };

    el.__vueClickOutside__ = handle; // eslint-disable-line
    document.addEventListener('click', handle);
  },

  unbind(el) {
    document.removeEventListener('click', el.__vueClickOutside__); // eslint-disable-line
    delete el.__vueClickOutside__; // eslint-disable-line
  },
};
