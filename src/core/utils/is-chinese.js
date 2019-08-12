function isChinese(name) {
  // 只能包含中文
  return /[\u4E00-\u9FA5]+/.test(name);
}

export default isChinese;

