import Vue from 'vue';
import { snakeCase } from 'lodash';
import accessModes from './resource/access-modes.filter';
import annotation from './resource/annotation.filter';
import appStatus from './app-status.filter';
import buildInsStatus from './build-ins-status.filter';
import capitalize from './capitatilze.filter';
import catalogStatus from './catalog-status.filter';
import configFile from './config-file.filter';
import configMap from './config-map.filter';
import date from './date.filter';
import dateFrom from './date-from.filter';
import debugPodSourceName from './resource/debug-pod-source-name.filter';
import deploymentActionStatus from './deployment-action-status.filter';
import deploymentStatus from './deployment-status.filter';
import deploymentType from './deployment-type.filter';
import entrypoint from './resource/entrypoint.filter';
import fen2yuan from './fen2yuan.filter';
import fileMode from './file-mode.filter';
import filterFilter from './filters.filter';
import floor from './floor.filter';
import hasHealthChecks from './resource/has-health-checks.filter';
import hashSize from './hash-size.filter';
import helpUrl from './help-url.filter';
import highlightKeywords from './resource/highlight-keywords.filter';
import humanizeDurationValue from './humanize-duration-value.filter';
import humanizeKind from './resource/humanize-kind.filter';
import humanizePodStatus from './resource/humanize-pod-status.filter';
import humanizeReason from './resource/humanize-reason.filter';
import humanizeSize from './resource/humanize-size.filter';
import humanizeTlsTermination from './resource/humanize-tls-termination.filter';
import imageObjectRef from './resource/image-object-ref.filter';
import imageStreamName from './resource/image-stream-name.filter';
import imageTag from './image-tag.filter';
import ingressWebUrl from './resource/ingress-web-url.filter';
import instanceDetail from './instance-detail.filter';
import instanceStatus from './instance-status.filter';
import isApproving from './is-approving.filter';
import isDebugPod from './resource/is-debug-pod.filter';
import isWebRoute from './resource/is-web-route.filter';
import lastDeploymentRevision from './resource/last-deployment-revision.filter';
import limitToFilter from './resource/limit-to.filter';
import limitToOrAll from './resource/limit-to-or-all.filter';
import lowerCase from './lower-case.filter';
import networkScope from './network-scope.filter';
import numContainerRestarts from './resource/num-container-restarts.filter';
import numContainersReady from './resource/num-container-ready.filter';
import opsStatus from './ops-status.filter';
import orderStatus from './order-status.filter';
import orderType from './order-type.filter';
import orgRole from './org-role.filter';
import otherwise from './otherwise.filter';
import percent from './percent.filter';
import planStatus from './plan-status.filter';
import platformRole from './platform-role.filter';
import podCompletionTime from './resource/pod-completion-time.filter';
import podStartTime from './resource/pod-start-time.filter';
import podStatus from './resource/pod-status.filter';
import podTemplate from './resource/pod-template.filter';
import prefix from './prefix.filter';
import prettifyJson from './pretty-json.filter';
import quotaApproval from './quota-approval.filter';
import routeIngressCondition from './resource/route-ingress-condition.filter';
import routeLabel from './resource/route-label.filter';
import routeTargetPortMapping from './resource/route-target-port-mapping.filter';
import routeWebUrl from './resource/route-web-url.filter';
import sentenceCase from './sentence-case.filter';
import serviceStatus from './service-status.filter';
import shortCommit from './short-commit.filter';
import spaceRole from './space-role.filter';
import startCaseFilter from './start-case.filter';
import storage from './storage.filter';
import stripShaPrefix from './resource/strip-sha-prefix.filter';
import translate from './translate.filter';
import truncate from './truncate.filter';
import unixDate from './unix-date.filter';
import upperCase from './upper-case.filter';
import usageWithUnits from './resource/usage-with-units.filter';
import volumeMountMode from './resource/volume-mount-mode.filter';
import zoneAuth from './zone-auth.filter';

const filters = {
  accessModes,
  annotation,
  appStatus,
  buildInsStatus,
  capitalize,
  catalogStatus,
  configFile,
  configMap,
  date,
  dateFrom,
  debugPodSourceName,
  deploymentActionStatus,
  deploymentStatus,
  deploymentType,
  entrypoint,
  fen2yuan,
  fileMode,
  filters: filterFilter,
  floor,
  hasHealthChecks,
  hashSize,
  helpUrl,
  highlightKeywords,
  humanizeDurationValue,
  humanizeKind,
  humanizePodStatus,
  humanizeReason,
  humanizeSize,
  humanizeTlsTermination,
  imageObjectRef,
  imageStreamName,
  imageTag,
  ingressWebUrl,
  instanceDetail,
  instanceStatus,
  isApproving,
  isDebugPod,
  isWebRoute,
  lastDeploymentRevision,
  limitToFilter,
  limitToOrAll,
  lowerCase,
  networkScope,
  numContainerRestarts,
  numContainersReady,
  opsStatus,
  orderStatus,
  orderType,
  orgRole,
  otherwise,
  percent,
  planStatus,
  platformRole,
  podCompletionTime,
  podStartTime,
  podStatus,
  podTemplate,
  prefix,
  prettifyJson,
  quotaApproval,
  routeIngressCondition,
  routeLabel,
  routeTargetPortMapping,
  routeWebUrl,
  sentenceCase,
  serviceStatus,
  shortCommit,
  spaceRole,
  startCaseFilter,
  storage,
  stripShaPrefix,
  translate,
  truncate,
  unixDate,
  upperCase,
  usageWithUnits,
  volumeMountMode,
  zoneAuth,
};

Object.keys(filters).forEach(key => {
  Vue.filter(snakeCase(key), filters[key]);
});

export default filters;
