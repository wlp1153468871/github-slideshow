export default class WebSocketService {
  static createWebSocket(url: string, protocols?: string | string[]) {
    if (url.indexOf('/') === 0) {
      if (window.location.protocol === 'http:') {
        url = 'ws://' + window.location.host + url;
      } else {
        url = 'wss://' + window.location.host + url;
      }
    }
    return new WebSocket(url, protocols);
  }
}
