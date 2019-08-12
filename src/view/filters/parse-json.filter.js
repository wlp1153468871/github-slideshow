export default function parseJSONFilter(json) {
  // return original value if its null or undefined
  if (!json) {
    return null;
  }

  // return the parsed obj if its valid
  try {
    const jsonObj = JSON.parse(json);
    if (typeof jsonObj === 'object') {
      return jsonObj;
    }
    return null;
  } catch (e) {
    // it wasn't valid json
    return null;
  }
}
