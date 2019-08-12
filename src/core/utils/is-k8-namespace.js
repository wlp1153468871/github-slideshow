/**
 * name start with a-z and only have (2, 20)
 * @param {String} name
 */
function isK8Namespace(name) {
  return /^[a-z0-9]([-a-z0-9]{0,20}[a-z0-9])$/.test(name);
}

export default isK8Namespace;
