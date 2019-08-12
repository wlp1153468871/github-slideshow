export default function endpointFilter(endpoint = {}) {
  const { protocol = '', port = '', host = '' } = endpoint;
  const isShowPort = port && port !== '80';
  return `${protocol}://${host}${isShowPort ? `:${port}` : ''}`;
}
