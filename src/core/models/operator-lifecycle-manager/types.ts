export type MatchExpression =
  |{ key: string; operator: 'Exists'|'DoesNotExist' }
  |{ key: string; operator: 'In'|'NotIn'|'Equals'|'NotEquals'; values: string[] };

export type Selector = {
  matchLabels?: { [key: string]: string };
  matchExpressions?: MatchExpression[];
};

export type K8sVerb =
  |'create'
  |'get'
  |'list'
  |'update'
  |'patch'
  |'delete'
  |'deletecollection'
  |'watch';

export type K8sKind = {
  abbr: string;
  kind: string;
  label: string;
  labelPlural: string;
  plural: string;
  propagationPolicy?: 'Foreground'|'Background';

  id?: string;
  crd?: boolean;
  apiVersion: string;
  apiGroup?: string;
  namespaced?: boolean;
  selector?: Selector;
  labels?: { [key: string]: string };
  annotations?: { [key: string]: string };
  verbs?: K8sVerb[];
};

export type OwnerReference = {
  name: string;
  kind: string;
  uid: string;
  apiVersion: string;
  controller?: boolean;
  blockOwnerDeletion?: boolean;
};

export type ObjectReference = {
  kind?: string;
  namespace?: string;
  name?: string;
  uid?: string;
  apiVersion?: string;
  resourceVersion?: string;
  fieldPath?: string;
};

export type ObjectMetadata = {
  name?: string;
  generateName?: string;
  uid?: string;
  annotations?: { [key: string]: string };
  namespace?: string;
  labels?: { [key: string]: string };
  ownerReferences?: OwnerReference[];
  deletionTimestamp?: string;
  [key: string]: any;
};

export type K8sResourceKind = {
  apiVersion?: string;
  kind?: string;
  metadata?: ObjectMetadata;
  spec?: {
    selector?: Selector;
    [key: string]: any;
  };
  status?: { [key: string]: any };
  type?: { [key: string]: any };
  data?: { [key: string]: any };
};

export enum SpecCapability {
  podCount = 'urn:alm:descriptor:com.tectonic.ui:podCount',
  endpointList = 'urn:alm:descriptor:com.tectonic.ui:endpointList',
  label = 'urn:alm:descriptor:com.tectonic.ui:label',
  resourceRequirements = 'urn:alm:descriptor:com.tectonic.ui:resourceRequirements',
  selector = 'urn:alm:descriptor:com.tectonic.ui:selector:',
  namespaceSelector = 'urn:alm:descriptor:com.tectonic.ui:namespaceSelector',
  k8sResourcePrefix = 'urn:alm:descriptor:io.kubernetes:',
  booleanSwitch = 'urn:alm:descriptor:com.tectonic.ui:booleanSwitch',

  password = 'urn:alm:descriptor:com.tectonic.ui:password',
  checkbox = 'urn:alm:descriptor:com.tectonic.ui:checkbox',
  imagePullPolicy = 'urn:alm:descriptor:com.tectonic.ui:imagePullPolicy',
  updateStrategy = 'urn:alm:descriptor:com.tectonic.ui:updateStrategy',
  text = 'urn:alm:descriptor:com.tectonic.ui:text',
  number = 'urn:alm:descriptor:com.tectonic.ui:number',
  nodeAffinity = 'urn:alm:descriptor:com.tectonic.ui:nodeAffinity',
  podAffinity = 'urn:alm:descriptor:com.tectonic.ui:podAffinity',
  podAntiAffinity = 'urn:alm:descriptor:com.tectonic.ui:podAntiAffinity',
  fieldGroup = 'urn:alm:descriptor:com.tectonic.ui:fieldGroup:',
  arrayFieldGroup = 'urn:alm:descriptor:com.tectonic.ui:arrayFieldGroup:',
}

export enum StatusCapability {
  podStatuses = 'urn:alm:descriptor:com.tectonic.ui:podStatuses',
  podCount = 'urn:alm:descriptor:com.tectonic.ui:podCount',
  w3Link = 'urn:alm:descriptor:org.w3:link',
  conditions = 'urn:alm:descriptor:io.kubernetes.conditions',
  text = 'urn:alm:descriptor:text',
  prometheusEndpoint = 'urn:alm:descriptor:prometheusEndpoint',
  k8sPhase = 'urn:alm:descriptor:io.kubernetes.phase',
  k8sPhaseReason = 'urn:alm:descriptor:io.kubernetes.phase:reason',
  // Prefix for all kubernetes resource status descriptors.
  k8sResourcePrefix = 'urn:alm:descriptor:io.kubernetes:',
}

export type Descriptor = {
  path: string;
  displayName: string;
  description: string;
  'x-descriptors': StatusCapability[]|SpecCapability[];
  value?: any;
};

export type DescriptorProps = {
  descriptor: Descriptor;
  value: any;
  obj: K8sResourceKind;
  model: K8sKind;
  namespace?: string;
};

export type CapabilityProps<C extends SpecCapability|StatusCapability> = {
  descriptor: Descriptor;
  capability: C;
  value: any;
  obj?: K8sResourceKind;
  model?: K8sKind;
  namespace?: string;
};
