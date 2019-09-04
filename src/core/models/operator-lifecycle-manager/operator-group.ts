import { K8sKind } from '@/core/models/operator-lifecycle-manager/types';
import {
  SubscriptionKind,
  OperatorGroupKind,
  PackageManifestKind,
  PackageManifestModel,
} from './constant';
import { get, isEmpty, map, isNil } from 'lodash';

export type GroupVersionKind = string;

export enum InstallModeType {
  InstallModeTypeOwnNamespace = 'OwnNamespace',
  InstallModeTypeSingleNamespace = 'SingleNamespace',
  InstallModeTypeMultiNamespace = 'MultiNamespace',
  InstallModeTypeAllNamespaces = 'AllNamespaces',
}

export type InstallModeSet = { type: InstallModeType; supported: boolean }[];

/**
 * Logic consistent with https://github.com/operator-framework/operator-lifecycle-manager/blob/4ef074e4207f5518d95ddf8c378036dfc4270dda/pkg/api/apis/operators/v1alpha1/clusterserviceversion.go#L165.
 */
export const supports = (set: InstallModeSet) => (obj: OperatorGroupKind) => {
  const namespaces = get(obj.status, 'namespaces') || [];
  const supportedModes = set.filter(({ supported }) => supported).map(({ type }) => type);

  if (namespaces.length === 0) {
    return false;
  } else if (namespaces.length === 1) {
    // @ts-ignore
    if (namespaces[0] === obj.metadata.namespace) {
      return supportedModes.includes(InstallModeType.InstallModeTypeOwnNamespace);
    }
    if (namespaces[0] === '') {
      return supportedModes.includes(InstallModeType.InstallModeTypeAllNamespaces);
    }
    return supportedModes.includes(InstallModeType.InstallModeTypeSingleNamespace);
  } else if (
    namespaces.length > 1 &&
    !supportedModes.includes(InstallModeType.InstallModeTypeMultiNamespace)
  ) {
    return false;
  } else if (namespaces.length > 1) {
    if (
      // @ts-ignore
      namespaces.includes(obj.metadata.namespace) &&
      !supportedModes.includes(InstallModeType.InstallModeTypeOwnNamespace)
    ) {
      return false;
    } else if (namespaces.includes('')) {
      return false;
    }
  }

  return true;
};

export const isGlobal = (obj: OperatorGroupKind) =>
  supports([{ type: InstallModeType.InstallModeTypeAllNamespaces, supported: true }])(obj);
export const isSingle = (obj: OperatorGroupKind) =>
  supports([{ type: InstallModeType.InstallModeTypeSingleNamespace, supported: true }])(obj);

/**
 * Determines if a given Operator package has a `Subscription` that makes it available in the given namespace.
 * Finds any `Subscriptions` for the given package, matches them to their `OperatorGroup`, and checks if the `OperatorGroup` is targeting the given namespace or if it is global.
 */
export const subscriptionFor = (allSubscriptions: SubscriptionKind[] = []) => (
  allGroups: OperatorGroupKind[] = [],
) => (pkgName: string) => (ns = '') => {
  return allSubscriptions.filter(sub => sub.spec.name === pkgName).find(sub =>
    allGroups.some(
      og =>
        // @ts-ignore
        og.metadata.namespace === sub.metadata.namespace &&
        // @ts-ignore
        (isGlobal(og) || get(og.status, 'namespaces', [] as string[]).includes(ns)),
    ),
  );
};

// FIXME(alecmerdler): Doesn't handle package name collisions...
export const installedFor = (allSubscriptions: SubscriptionKind[] = []) => (
  allGroups: OperatorGroupKind[] = [],
) => (pkgName: string) => (ns = '') => {
  return !isNil(subscriptionFor(allSubscriptions)(allGroups)(pkgName)(ns));
};

export const referenceForGroupVersionKind = (group: string) => (version: string) => (
  kind: string,
) => [group, version, kind].join('~');

export const providedAPIsFor = (og: OperatorGroupKind) =>
  // @ts-ignore
  get(og.metadata.annotations, 'olm.providedAPIs', '')
    .split(',')
    .map(api => ({
      group: api
        .split('.')
        .slice(2)
        .join('.'),
      version: api.split('.')[1],
      kind: api.split('.')[0],
    }))
    .map(({ group, version, kind }) => referenceForGroupVersionKind(group)(version)(kind));

export type OperatorGroupSelectorProps = {
  onChange?: (name: string, kind: GroupVersionKind) => void;
  excludeName?: string;
  dataFilter?: (obj: OperatorGroupKind) => boolean;
};

// TODO: fix
export const k8sBasePath = '/';

const getK8sAPIPath = (model: K8sKind) => {
  const isLegacy = get(model, 'apiGroup', 'core') === 'core' && model.apiVersion === 'v1';
  let p = k8sBasePath;

  if (isLegacy) {
    p += '/api/';
  } else {
    p += '/apis/';
  }

  if (!isLegacy && model.apiGroup) {
    p += `${model.apiGroup}/`;
  }

  p += model.apiVersion;
  return p;
};

export const resourceURL = (
  model: K8sKind,
  options: { ns?: string; name?: string; path?: string; queryParams?: { [k: string]: string } },
) => {
  let q = [];
  let u = getK8sAPIPath(model);

  if (options.ns) {
    u += `/namespaces/${options.ns}`;
  }
  u += `/${model.plural}`;
  if (options.name) {
    u += `/${options.name}`;
  }
  if (options.path) {
    u += `/${options.path}`;
  }
  if (!isEmpty(options.queryParams)) {
    q = map(options.queryParams, function(v, k) {
      return `${k}=${v}`;
    });
    u += `?${q.join('&')}`;
  }

  return u;
};

export const iconFor = (pkg: PackageManifestKind) =>
  resourceURL(PackageManifestModel, {
    ns: get(pkg.status, 'catalogSourceNamespace'),
    // @ts-ignore
    name: pkg.metadata.name,
    path: 'icon',
    queryParams: {
      resourceVersion: [
        // @ts-ignore
        pkg.metadata.name,
        get(pkg.status, 'channels[0].name'),
        get(pkg.status, 'channels[0].currentCSV'),
      ].join('.'),
    },
  });
