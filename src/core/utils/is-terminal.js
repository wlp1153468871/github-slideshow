/**
 * check key is terminal-url
 * @param {String} name name
 */
function isTerminal(name) {
  const nameSet = new Set([
    '控制台地址',
    'dashboard_url',
  ]);
  return nameSet.has(name);
}

export default isTerminal;
