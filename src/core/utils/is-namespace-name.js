/**
 * name starts with a-z, includes a-z,0-9,-
 * @param {String} name org and space short_name
 */
function isNamespaceName(name) {
  return /^[a-z0-9]([-a-z0-9]*[a-z0-9])?([a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/.test(name);
}

export default isNamespaceName;
