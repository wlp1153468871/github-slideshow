import parseJSONFilter from '@/view/filters/parse-json.filter';

export default function prettifyJson(json) {
  const jsonObj = parseJSONFilter(json);
  if (jsonObj) {
    return JSON.stringify(jsonObj, null, 4);
  }
  // it wasn't a json object, return the original value
  return json;
}
