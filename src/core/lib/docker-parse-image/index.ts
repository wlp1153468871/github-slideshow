import DockerImage from './docker-image';

function dockerParseImage(image: string) {
  const match = image.match(/^(?:([^\/]+)\/)?(?:([^\/]+)\/)?([^@:\/]+)(?:[@:](.+))?$/) || [];

  let registry = match[1];
  let namespace = match[2];
  const repository = match[3];
  const tag = match[4];

  if (!namespace && registry && !/[:.]/.test(registry)) {
    namespace = registry;
    registry = '';
  }

  return new DockerImage(registry, namespace, repository, tag);
}

export default dockerParseImage;
