function isLegacyName(name) {
  return /^\w{6,25}$/.test(name);
}

export default isLegacyName;
