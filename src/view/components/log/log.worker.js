import uniq from 'lodash.uniq';

// eslint-disable-next-line no-restricted-globals
self.addEventListener('message', event => {
  let keys = [];
  const mapLogs = event.data.map(log => {
    let jsonData;
    let isJSON = false;
    try {
      jsonData = JSON.parse(log);
      isJSON = true;

      // refer to performance test
      // https://www.measurethat.net/Benchmarks/Show/5043/0/array-immutable-union-lodash-union-vs-objectassign-vs-u#latest_results_block
      keys = uniq([...keys, ...Object.keys(jsonData)]);
      // eslint-disable-next-line no-empty
    } catch (e) {}
    return {
      isJSON,
      message: jsonData,
      info: log,
    };
  });
  postMessage({ mapLogs, keys });
});
