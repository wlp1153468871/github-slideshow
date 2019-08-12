import annotationFilter from '@/view/filters/resource/annotation.filter';

export default function debugPodSourceName(pod) {
  const source = annotationFilter(pod, 'debug.openshift.io/source-resource');
  if (!source) {
    return '';
  }

  const parts = source.split('/');
  if (parts.length !== 2) {
    console.warn(`Invalid debug.openshift.io/source-resource annotation value "${source}"`);
    return '';
  }

  return parts[1];
}
