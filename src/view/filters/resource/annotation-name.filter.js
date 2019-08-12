export default function annotationNameFilter(annotationKey) {
  // This maps an annotation key to all known synonymous keys to insulate
  // the referring code from key renames across API versions.
  const annotationMap = {
    buildConfig: ['openshift.io/build-config.name'],
    deploymentConfig: ['openshift.io/deployment-config.name'],
    deployment: ['openshift.io/deployment.name'],
    pod: ['openshift.io/deployer-pod.name'],
    deployerPod: ['openshift.io/deployer-pod.name'],
    deployerPodFor: ['openshift.io/deployer-pod-for.name'],
    deploymentStatus: ['openshift.io/deployment.phase'],
    deploymentStatusReason: ['openshift.io/deployment.status-reason'],
    deploymentCancelled: ['openshift.io/deployment.cancelled'],
    encodedDeploymentConfig: ['openshift.io/encoded-deployment-config'],
    deploymentVersion: ['openshift.io/deployment-config.latest-version'],
    displayName: ['openshift.io/display-name'],
    description: ['openshift.io/description'],
    buildNumber: ['openshift.io/build.number'],
    buildPod: ['openshift.io/build.pod-name'],
    jenkinsBuildURL: ['openshift.io/jenkins-build-uri'],
    jenkinsLogURL: ['openshift.io/jenkins-log-url'],
    jenkinsStatus: ['openshift.io/jenkins-status-json'],
    loggingUIHostname: ['openshift.io/logging.ui.hostname'],
    loggingDataPrefix: ['openshift.io/logging.data.prefix'],
    idledAt: ['idling.alpha.openshift.io/idled-at'],
    idledPreviousScale: ['idling.alpha.openshift.io/previous-scale'],
    systemOnly: ['authorization.openshift.io/system-only'],
  };
  return annotationMap[annotationKey] || null;
}
