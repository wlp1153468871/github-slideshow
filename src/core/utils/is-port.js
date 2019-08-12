const PORT_LIMIT = (2 ** 16) - 1;

/**
 * check port is valid
 * @param {String|Number} port post of the url
 */
export default function isPort(port) {
  port = Number(port);
  return Number.isInteger(port) &&
    port > 0 &&
    port <= PORT_LIMIT;
}
