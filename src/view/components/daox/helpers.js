export function getFocusedElementId() {
  return document.activeElement.id;
}

export function getFocusedTabIndex(tabs = []) {
  const activeId = getFocusedElementId();
  return tabs.findIndex(tab => tab.tabId === activeId);
}

export function findElementAndFocus(elemId) {
  const elem = document.getElementById(elemId);
  if (elem) {
    elem.focus();
  }
}

export function isPromise(func) {
  return func.then && typeof func.then === 'function';
}
