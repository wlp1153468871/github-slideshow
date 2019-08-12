import annotationFilter from '@/view/filters/resource/annotation.filter';

export default function isDebugPod(pod) {
  return !!annotationFilter(pod, 'debug.openshift.io/source-resource');
}
