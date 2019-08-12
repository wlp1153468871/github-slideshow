import annotationFilter from '@/view/filters/resource/annotation.filter';

export default function lastDeploymentRevisionFilter(deployment) {
  if (!deployment) return '';

  const revision = annotationFilter(
    deployment,
    'deployment.kubernetes.io/revision',
  );
  return revision ? `#${revision}` : 'Unknown';
}
