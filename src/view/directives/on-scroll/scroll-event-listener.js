import { throttle } from 'lodash';

class ScrollEventListener {
  constructor(el, expression) {
    this.el = el;
    this.expression = expression;

    // default setting;
    this.throttleDelay = 200; // milliseconds
    this.scrollListener = null;
  }

  scrollTopListener() {
    const { scrollTop } = this.el;

    const shouldTrigger = scrollTop === 0;
    if (shouldTrigger && this.expression) {
      this.expression();
    }
  }

  scrollButtomListener() {
    const { scrollTop, offsetHeight, scrollHeight } = this.el;
    const shouldTrigger = scrollTop + offsetHeight === scrollHeight;
    if (shouldTrigger && this.expression) {
      this.expression();
    }
  }

  listenScrollTop() {
    this.bind(this.scrollTopListener);
  }

  listenScrollButtom() {
    this.bind(this.scrollButtomListener);
  }

  bind(listener) {
    if (this.scrollListener) return; // already bound!

    // only support scroll-top and scroll-buttom listener;
    this.scrollListener = throttle(listener.bind(this), this.throttleDelay);
    if (this.scrollListener) {
      this.el.addEventListener('scroll', this.scrollListener);
    }
  }

  unbind() {
    if (this.scrollListener) {
      this.el.removeEventListener('scroll', this.scrollListener);
    }
  }
}

export default ScrollEventListener;
