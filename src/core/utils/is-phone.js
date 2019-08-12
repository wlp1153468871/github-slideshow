/**
 * 宽松版本的手机号码校验
 * @param {String} phone just phone number
 */
function isPhone(phone) {
  return /^([1-9])\d{10}$/.test(phone);
}

export default isPhone;
