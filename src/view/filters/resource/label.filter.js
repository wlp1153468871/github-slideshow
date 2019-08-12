export default function labelFilter(resource, key) {
  if (resource && resource.metadata && resource.metadata.labels) {
    return resource.metadata.labels[key];
  }
  return null;
}
