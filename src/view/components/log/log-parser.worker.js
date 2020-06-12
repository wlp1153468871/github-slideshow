// eslint-disable-next-line no-restricted-globals
self.addEventListener('message', event => {
  let keys = [];
  const mapLogs = event.data.map(log => {
    let jsonData;
    let isJSON = false;
    try {
      jsonData = JSON.parse(log);
      isJSON = true;
      keys = [...keys, ...Object.keys(jsonData)];
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
