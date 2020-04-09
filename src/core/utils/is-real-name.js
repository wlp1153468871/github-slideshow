function isRealName(name) {
  return /^[\u4E00-\u9FA5A-Za-z]{2,20}$/.test(name);
}

export default isRealName;
