const { getComputedStyle } = document.defaultView;

export default class DomUtil {
  static isAttached(el) {
    let currentNode = el.parentNode;
    while (currentNode) {
      if (currentNode.tagName === 'HTML') return true;
      if (currentNode.nodeType === 11) return false;
      currentNode = currentNode.parentNode;
    }
    return false;
  }

  static getScrollEventTarget(element) {
    let currentNode = element;
    // bugfix
    // see http://w3help.org/zh-cn/causes/SD9013
    // and http://stackoverflow.com/questions/17016740/onscroll-function-is-not-working-for-chrome
    while (
      currentNode &&
      currentNode.tagName !== 'HTML' &&
      currentNode.tagName !== 'BODY' &&
      currentNode.nodeType === 1
    ) {
      const { overflowY } = getComputedStyle(currentNode);
      if (overflowY === 'scroll' || overflowY === 'auto') {
        return currentNode;
      }
      currentNode = currentNode.parentNode;
    }
    return window;
  }

  static getScrollTop(el) {
    if (el === window) {
      return Math.max(window.pageYOffset || 0, document.documentElement.scrollTop);
    }
    return el.scrollTop;
  }

  static getVisibleHeight(el) {
    if (el === window) {
      return document.documentElement.clientHeight;
    }

    return el.clientHeight;
  }

  static getElementTop(el) {
    if (el === window) {
      return DomUtil.getScrollTop(window);
    }
    return el.getBoundingClientRect().top + DomUtil.getScrollTop(window);
  }
}
