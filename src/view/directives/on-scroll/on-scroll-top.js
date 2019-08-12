import DomUtil from './dom-utils';
import ScrollEventListener from './scroll-event-listener';

const ctx = '@ScrollTop';

export default {
  bind(el, binding, vnode) {
    const vm = vnode.context;
    const expression = binding.value;
    const event = new ScrollEventListener(el, expression);
    el[ctx] = event;

    vm.$on('hook:mounted', () => {
      vm.$nextTick(() => {
        if (DomUtil.isAttached(el)) {
          event.listenScrollTop();
        }
      });
    });

    vm.$on('hook:beforeDestroy', () => {
      event.unbind();
    });
  },

  unbind(el) {
    if (el && el[ctx]) {
      el[ctx].unbind();
    }
  },

};
