/**
 * check string is WHATWG-URL
 * but now just check:
 *  is http(s)
 * @param {String} url URL
 */

const DNSRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/;
const ipRegex = /^https?:\/\/(www\.)?(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(:[0-9]{1,5})?/;

function isURL(url) {
  return DNSRegex.test(url) || ipRegex.test(url);
}

export default isURL;
