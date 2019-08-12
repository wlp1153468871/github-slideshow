import annotationNameFilter from '@/view/filters/resource/annotation-name.filter';

export default function annotationFilter(resource, key) {
  if (resource && resource.metadata && resource.metadata.annotations) {
    // If the key's already in the annotation map, return it.
    if (resource.metadata.annotations[key] !== undefined) {
      return resource.metadata.annotations[key];
    }
    // Try and return a value for a mapped key.
    const mappings = annotationNameFilter(key) || [];
    for (let i = 0; i < mappings.length; i += 1) {
      const mappedKey = mappings[i];
      if (resource.metadata.annotations[mappedKey] !== undefined) {
        return resource.metadata.annotations[mappedKey];
      }
    }
    // Couldn't find anything.
    return null;
  }
  return null;
}
