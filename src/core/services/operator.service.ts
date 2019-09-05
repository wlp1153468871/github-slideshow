import api, { APIService } from './api';
import store from '@/core/store';
/* tslint:disable */
class OperatorService {
  api: APIService;

  constructor() {
    this.api = api;
  }

  get space(): string {
    return store.getters.spaceId;
  }

  get zone(): string {
    return store.state.zone.id;
  }

  listOperatorGroups() {
    return Promise.resolve({
      apiVersion: 'operators.coreos.com/v1',
      items: [
        {
          apiVersion: 'operators.coreos.com/v1',
          kind: 'OperatorGroup',
          metadata: {
            annotations: {
              'kubectl.kubernetes.io/last-applied-configuration':
                '{"apiVersion":"operators.coreos.com/v1","kind":"OperatorGroup","metadata":{"annotations":{},"name":"ns-og","namespace":"ck"},"spec":{"targetNamespaces":["ck"]}}\n',
              'olm.providedAPIs': 'PodSet.v1alpha1.app.example.com',
            },
            creationTimestamp: '2019-09-02T03:09:19Z',
            generation: 1,
            name: 'ns-og',
            namespace: 'ck',
            resourceVersion: '1438725',
            selfLink: '/apis/operators.coreos.com/v1/namespaces/ck/operatorgroups/ns-og',
            uid: '174a1b46-482d-4804-add9-53beeee1b5cd',
          },
          spec: { targetNamespaces: ['ck'] },
          status: { lastUpdated: '2019-09-02T03:09:19Z', namespaces: ['ck'] },
        },
        {
          apiVersion: 'operators.coreos.com/v1',
          kind: 'OperatorGroup',
          metadata: {
            annotations: { 'olm.providedAPIs': '' },
            creationTimestamp: '2019-08-30T02:41:40Z',
            generateName: 'default-',
            generation: 1,
            name: 'default-26rdc',
            namespace: 'default',
            resourceVersion: '734857',
            selfLink:
              '/apis/operators.coreos.com/v1/namespaces/default/operatorgroups/default-26rdc',
            uid: 'bdb6d6f8-225b-4723-98d4-727b4f49ab7c',
          },
          spec: { targetNamespaces: ['default'] },
          status: { lastUpdated: '2019-08-30T02:41:40Z', namespaces: ['default'] },
        },
        {
          apiVersion: 'operators.coreos.com/v1',
          kind: 'OperatorGroup',
          metadata: {
            annotations: {
              'kubectl.kubernetes.io/last-applied-configuration':
                '{"apiVersion":"operators.coreos.com/v1","kind":"OperatorGroup","metadata":{"annotations":{},"name":"olm-operators","namespace":"olm"},"spec":{"targetNamespaces":["olm"]}}\n',
              'olm.providedAPIs': 'PackageManifest.v1.packages.operators.coreos.com',
            },
            creationTimestamp: '2019-08-26T08:06:27Z',
            generation: 1,
            name: 'olm-operators',
            namespace: 'olm',
            resourceVersion: '781625',
            selfLink: '/apis/operators.coreos.com/v1/namespaces/olm/operatorgroups/olm-operators',
            uid: '24bac05a-ae19-49c4-abb9-c3bd0a081d7f',
          },
          spec: { targetNamespaces: ['olm'] },
          status: { lastUpdated: '2019-08-26T08:27:50Z', namespaces: ['olm'] },
        },
        {
          apiVersion: 'operators.coreos.com/v1',
          kind: 'OperatorGroup',
          metadata: {
            annotations: {
              'kubectl.kubernetes.io/last-applied-configuration':
                '{"apiVersion":"operators.coreos.com/v1","kind":"OperatorGroup","metadata":{"annotations":{},"name":"global-operators","namespace":"operators"}}\n',
              'olm.providedAPIs': '',
            },
            creationTimestamp: '2019-08-26T08:06:27Z',
            generation: 2,
            name: 'global-operators',
            namespace: 'operators',
            resourceVersion: '781702',
            selfLink:
              '/apis/operators.coreos.com/v1/namespaces/operators/operatorgroups/global-operators',
            uid: '605a0250-0327-4936-bd9d-eac35838ef06',
          },
          spec: {},
          status: { lastUpdated: '2019-08-26T08:27:50Z', namespaces: [''] },
        },
        {
          apiVersion: 'operators.coreos.com/v1',
          kind: 'OperatorGroup',
          metadata: {
            annotations: { 'olm.providedAPIs': '' },
            creationTimestamp: '2019-08-30T02:35:33Z',
            generateName: 'test-',
            generation: 4,
            name: 'test-grfhb',
            namespace: 'test',
            resourceVersion: '1938517',
            selfLink: '/apis/operators.coreos.com/v1/namespaces/test/operatorgroups/test-grfhb',
            uid: '47b60822-2bea-4b13-905f-53dd15eb141f',
          },
          spec: { targetNamespaces: ['test'] },
          status: { lastUpdated: '2019-08-30T04:00:05Z', namespaces: ['test'] },
        },
      ],
      kind: 'OperatorGroupList',
      metadata: {
        continue: '',
        resourceVersion: '2157304',
        selfLink: '/apis/operators.coreos.com/v1/operatorgroups',
      },
    });
  }

  listPackageManifests() {
    return Promise.resolve({
      kind: 'PackageManifestList',
      apiVersion: 'packages.operators.coreos.com/v1',
      metadata: {
        selfLink: '/apis/packages.operators.coreos.com/v1/namespaces/test/packagemanifests',
      },
      items: [
        {
          metadata: {
            name: 'elasticsearch',
            namespace: 'test',
            selfLink:
              '/apis/packages.operators.coreos.com/v1/namespaces/test/packagemanifests/elasticsearch',
            creationTimestamp: '2019-08-30T04:05:35Z',
            labels: {
              catalog: 'my-operator-catalog',
              'catalog-namespace': 'olm',
              provider: 'DaoCloud',
              'provider-url': '',
            },
          },
          spec: {},
          status: {
            catalogSource: 'my-operator-catalog',
            catalogSourceDisplayName: 'DaoCloud Operators',
            catalogSourcePublisher: 'daocloud.io',
            catalogSourceNamespace: 'olm',
            provider: {
              name: 'DaoCloud',
            },
            packageName: 'elasticsearch',
            channels: [
              {
                name: 'preview',
                currentCSV: 'elasticsearch.v0.9.0',
                currentCSVDesc: {
                  displayName: 'ElasticSearch',
                  icon: [
                    {
                      base64data:
                        'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPHBhdGggZmlsbD0iIzM0Mzc0MSIgZD0iTTM3LjA2MjUsMzIgQzM3LjA2MjUsMzQuNzk2IDM0Ljc5NTUsMzcuMDYyIDMyLjAwMDUsMzcuMDYyIEMyOS4yMDQ1LDM3LjA2MiAyNi45Mzc1LDM0Ljc5NiAyNi45Mzc1LDMyIEMyNi45Mzc1LDI5LjIwNCAyOS4yMDQ1LDI2LjkzOCAzMi4wMDA1LDI2LjkzOCBDMzQuNzk1NSwyNi45MzggMzcuMDYyNSwyOS4yMDQgMzcuMDYyNSwzMiIvPgogICAgPHBhdGggZmlsbD0iI0YwNEU5OCIgZD0iTTM4LjIyMjcsMjQuMTA0NSBDMzguMjY1NywyNC4xMzg1IDM4LjMwOTcsMjQuMTczNSAzOC4zNTI3LDI0LjIwODUgQzM5LjI5MDcsMjQuOTcyNSA0MC41ODU3LDI1LjEyMDUgNDEuNjc3NywyNC41OTc1IEw1NS4xNzE3LDE4LjE0MTUgQzUxLjg3NDcsMTIuNjQwNSA0Ni42NzU3LDguNDE2NSA0MC40ODI3LDYuMzY3NSBMMzcuMTE4NywyMC45NDI1IEMzNi44NDU3LDIyLjEyMTUgMzcuMjcxNywyMy4zNTU1IDM4LjIyMjcsMjQuMTA0NSIvPgogICAgPHBhdGggZmlsbD0iIzA3QyIgZD0iTTMyLjE4NTUsNDQuMTgzNiBDMzEuOTE4NSw0My4wMDI2IDMwLjk5OTUsNDIuMDc1NiAyOS44MTg1LDQxLjgxMzYgQzI1LjMxNjUsNDAuODE1NiAyMS45Mzc1LDM2Ljc5ODYgMjEuOTM3NSwzMS45OTk2IEMyMS45Mzc1LDI3LjE4MjYgMjUuMzQxNSwyMy4xNTI2IDI5Ljg3MDUsMjIuMTczNiBDMzEuMDUyNSwyMS45MTg2IDMxLjk3NTUsMjAuOTk0NiAzMi4yNDc1LDE5LjgxNTYgTDM1LjYxMDUsNS4yNDc2IEMzNC40Mjg1LDUuMDg5NiAzMy4yMjQ1LDQuOTk5NiAzMS45OTk1LDQuOTk5NiBDMTcuMDg3NSw0Ljk5OTYgNC45OTk1LDE3LjA4ODYgNC45OTk1LDMxLjk5OTYgQzQuOTk5NSw0Ni45MTE2IDE3LjA4NzUsNTguOTk5NiAzMS45OTk1LDU4Ljk5OTYgQzMzLjE3ODUsNTguOTk5NiAzNC4zMzY1LDU4LjkxNTYgMzUuNDc0NSw1OC43Njk2IEwzMi4xODU1LDQ0LjE4MzYgWiIvPgogICAgPHBhdGggZmlsbD0iIzM0Mzc0MSIgZD0iTTU3LjI4NTIsNDEuNDc4IEM1OC4zOTAyLDM4LjUyOCA1OS4wMDAyLDM1LjMzNiA1OS4wMDAyLDMyIEM1OS4wMDAyLDI4LjcxMyA1OC40MTEyLDI1LjU2MyA1Ny4zMzUyLDIyLjY0OSBMNDMuNzUyMiwyOS4xNDggQzQyLjY1MzIsMjkuNjc0IDQxLjk2MjIsMzAuNzg2IDQxLjk2MTE5MDIsMzIuMDA0IEw0MS45NjExOTAyLDMyLjA1NCBDNDEuOTU4MiwzMy4yNyA0Mi42NDMyLDM0LjM4MSA0My43MzcyLDM0LjkxMSBMNTcuMjg1Miw0MS40NzggWiIvPgogICAgPHBhdGggZmlsbD0iI0YwNEU5OCIgZD0iTTM4LjMxMDUsMzkuODIzNyBDMzguMjY3NSwzOS44NTc3IDM4LjIyNDUsMzkuODkxNyAzOC4xODE1LDM5LjkyNTcgQzM3LjIyNzUsNDAuNjY5NyAzNi43OTU1LDQxLjkwMDcgMzcuMDYxNSw0My4wODE3IEw0MC4zNTM1LDU3LjY3NjcgQzQ2LjU1OTUsNTUuNjU3NyA1MS43ODE1LDUxLjQ1OTcgNTUuMTA0NSw0NS45Nzc3IEw0MS42Mzk1LDM5LjQ1MDcgQzQwLjU0OTUsMzguOTIyNyAzOS4yNTI1LDM5LjA2MzcgMzguMzEwNSwzOS44MjM3Ii8+CiAgPC9nPgo8L3N2Zz4K',
                      mediatype: 'image/svg+xml',
                    },
                  ],
                  version: '0.9.0',
                  provider: {
                    name: 'DaoCloud',
                  },
                  annotations: {
                    'alm-examples':
                      '[\n  {\n  \t"apiVersion": "elasticsearch.k8s.elastic.co\\/v1alpha1",\n  \t"kind": "Elasticsearch",\n  \t"metadata": {\n  \t\t"name": "elasticsearch-sample"\n  \t},\n  \t"spec": {\n  \t\t"version": "7.2.0",\n  \t\t"nodes": [{\n  \t\t\t"config": {\n  \t\t\t\t"node.master": true,\n  \t\t\t\t"node.data": true,\n  \t\t\t\t"node.attr.attr_name": "attr_value"\n  \t\t\t},\n  \t\t\t"podTemplate": {\n  \t\t\t\t"metadata": {\n  \t\t\t\t\t"labels": {\n  \t\t\t\t\t\t"foo": "bar"\n  \t\t\t\t\t}\n  \t\t\t\t},\n  \t\t\t\t"spec": {\n  \t\t\t\t\t"containers": [{\n  \t\t\t\t\t\t"name": "elasticsearch",\n  \t\t\t\t\t\t"resources": {\n  \t\t\t\t\t\t\t"limits": {\n  \t\t\t\t\t\t\t\t"memory": "2Gi",\n  \t\t\t\t\t\t\t\t"cpu": 1\n  \t\t\t\t\t\t\t}\n  \t\t\t\t\t\t}\n  \t\t\t\t\t}]\n  \t\t\t\t}\n  \t\t\t},\n  \t\t\t"nodeCount": 3\n  \t\t}]\n  \t}\n  },\n  {\n  \t"apiVersion": "kibana.k8s.elastic.co\\/v1alpha1",\n  \t"kind": "Kibana",\n  \t"metadata": {\n  \t\t"name": "kibana-sample"\n  \t},\n  \t"spec": {\n  \t\t"version": "7.2.0",\n  \t\t"nodeCount": 1,\n  \t\t"elasticsearchRef": {\n  \t\t\t"name": "elasticsearch-sample"\n  \t\t},\n  \t\t"podTemplate": {\n  \t\t\t"metadata": {\n  \t\t\t\t"labels": {\n  \t\t\t\t\t"foo": "bar"\n  \t\t\t\t}\n  \t\t\t},\n  \t\t\t"spec": {\n  \t\t\t\t"containers": [{\n  \t\t\t\t\t"name": "kibana",\n  \t\t\t\t\t"resources": {\n  \t\t\t\t\t\t"limits": {\n  \t\t\t\t\t\t\t"memory": "1Gi",\n  \t\t\t\t\t\t\t"cpu": 1\n  \t\t\t\t\t\t}\n  \t\t\t\t\t}\n  \t\t\t\t}]\n  \t\t\t}\n  \t\t}\n  \t}\n  },\n  {\n    "apiVersion": "apm.k8s.elastic.co\\/v1alpha1",\n    "kind": "ApmServer",\n    "metadata": {\n      "labels": {\n        "controller-tools.k8s.io": "1.0"\n      },\n      "name": "apmserver-sample"\n    },\n    "spec": {\n      "version": "7.2.0",\n      "nodeCount": 1,\n      "elasticsearchRef": {\n  \t\t\t"name": "elasticsearch-sample"\n  \t\t}\n    }\n  }\n]\n',
                    capabilities: 'Full Lifecycle',
                    categories: 'Database',
                    certified: 'false',
                    containerImage: 'docker.elastic.co/eck/eck-operator:0.9.0',
                    createdAt: '2019-04-30 18:35:59',
                    description:
                      '在Kubernetes或OpenShift平台上部署Elasticsearch、Kibana和APM Server',
                    repository: 'https://github.com/elastic/cloud-on-k8s',
                    support: 'elastic.co',
                  },
                  description:
                    '支持在Kubernetes上对Elasticsearch，Kibana和APM Server进行自动部署、配置和管理。\n这是一个alpha版本。\n当前功能：\n\n*  Elasticsearch，Kibana和APM Server自动部署\n*  TLS认证\n*  持久化存储\n*  自定义集群配置\n\n支持版本：\n\n*  Kubernetes: 1.11+\n\n快速入门请参阅此文档 [Quickstart](https://www.elastic.co/guide/en/cloud-on-k8s/0.9/index.html)',
                  installModes: [
                    {
                      type: 'OwnNamespace',
                      supported: true,
                    },
                    {
                      type: 'SingleNamespace',
                      supported: true,
                    },
                    {
                      type: 'MultiNamespace',
                      supported: false,
                    },
                    {
                      type: 'AllNamespaces',
                      supported: true,
                    },
                  ],
                  customresourcedefinitions: {
                    owned: [
                      {
                        name: 'elasticsearches.elasticsearch.k8s.elastic.co',
                        version: 'v1alpha1',
                        kind: 'Elasticsearch',
                        displayName: 'Elasticsearch集群',
                        description: 'ElasticSearch实例',
                      },
                      {
                        name: 'kibanas.kibana.k8s.elastic.co',
                        version: 'v1alpha1',
                        kind: 'Kibana',
                        displayName: 'Kibana',
                        description: 'Kibana实例',
                      },
                      {
                        name: 'apmservers.apm.k8s.elastic.co',
                        version: 'v1alpha1',
                        kind: 'ApmServer',
                        displayName: 'APM server',
                        description: 'APM server实例',
                      },
                    ],
                  },
                  apiservicedefinitions: {},
                },
              },
            ],
            defaultChannel: 'preview',
          },
        },
        {
          metadata: {
            name: 'kubebuilder-demo',
            namespace: 'test',
            selfLink:
              '/apis/packages.operators.coreos.com/v1/namespaces/test/packagemanifests/kubebuilder-demo',
            creationTimestamp: '2019-08-30T04:05:35Z',
            labels: {
              catalog: 'my-operator-catalog',
              'catalog-namespace': 'olm',
              provider: '',
              'provider-url': '',
            },
          },
          spec: {},
          status: {
            catalogSource: 'my-operator-catalog',
            catalogSourceDisplayName: 'DaoCloud Operators',
            catalogSourcePublisher: 'daocloud.io',
            catalogSourceNamespace: 'olm',
            provider: {},
            packageName: 'kubebuilder-demo',
            channels: [
              {
                name: 'version-1',
                currentCSV: 'kubebuilder-demo.v0.1.0',
                currentCSVDesc: {
                  displayName: 'Kubebuilder Demo',
                  version: '0.1.0',
                  provider: {},
                  annotations: {
                    capabilities: 'Basic Install',
                  },
                  description: 'Placeholder description',
                  installModes: [
                    {
                      type: 'OwnNamespace',
                      supported: true,
                    },
                    {
                      type: 'SingleNamespace',
                      supported: true,
                    },
                    {
                      type: 'MultiNamespace',
                      supported: false,
                    },
                    {
                      type: 'AllNamespaces',
                      supported: true,
                    },
                  ],
                  customresourcedefinitions: {
                    owned: [
                      {
                        name: 'sloops.ships.k8s.io',
                        version: 'v1beta1',
                        kind: 'Sloop',
                        displayName: 'kubebuilder-demo',
                        description: 'kubebuilder-demo',
                      },
                    ],
                  },
                  apiservicedefinitions: {},
                },
              },
            ],
            defaultChannel: 'version-1',
          },
        },
        {
          metadata: {
            name: 'podset',
            namespace: 'test',
            selfLink:
              '/apis/packages.operators.coreos.com/v1/namespaces/test/packagemanifests/podset',
            creationTimestamp: '2019-08-30T04:05:35Z',
            labels: {
              catalog: 'my-operator-catalog',
              'catalog-namespace': 'olm',
              provider: 'DaoCloud',
              'provider-url': '',
            },
          },
          spec: {},
          status: {
            catalogSource: 'my-operator-catalog',
            catalogSourceDisplayName: 'DaoCloud Operators',
            catalogSourcePublisher: 'daocloud.io',
            catalogSourceNamespace: 'olm',
            provider: {
              name: 'DaoCloud',
            },
            packageName: 'podset',
            channels: [
              {
                name: 'version-1',
                currentCSV: 'podset-operator.v0.1.0',
                currentCSVDesc: {
                  displayName: 'PodSet Operator',
                  version: '0.1.0',
                  provider: {
                    name: 'DaoCloud',
                  },
                  annotations: {
                    'alm-examples':
                      '[{"apiVersion":"app.example.com/v1alpha1","kind":"PodSet","metadata":{"name":"example-podset"},"spec":{"replicas":3}}]',
                    capabilities: 'Basic Install',
                  },
                  description:
                    '这是一个Operator Demo，生成并维护指定数目的busybox容器，没有实际用途',
                  installModes: [
                    {
                      type: 'OwnNamespace',
                      supported: true,
                    },
                    {
                      type: 'SingleNamespace',
                      supported: true,
                    },
                    {
                      type: 'MultiNamespace',
                      supported: true,
                    },
                    {
                      type: 'AllNamespaces',
                      supported: true,
                    },
                  ],
                  customresourcedefinitions: {
                    owned: [
                      {
                        name: 'podsets.app.example.com',
                        version: 'v1alpha1',
                        kind: 'PodSet',
                        displayName: 'PodSet',
                        description: '创建PodSet实例',
                      },
                    ],
                  },
                  apiservicedefinitions: {},
                },
              },
              {
                name: 'version-2',
                currentCSV: 'podset-operator.v0.1.0',
                currentCSVDesc: {
                  displayName: 'PodSet Operator',
                  version: '0.1.0',
                  provider: {
                    name: 'DaoCloud',
                  },
                  annotations: {
                    'alm-examples':
                      '[{"apiVersion":"app.example.com/v1alpha1","kind":"PodSet","metadata":{"name":"example-podset"},"spec":{"replicas":3}}]',
                    capabilities: 'Basic Install',
                  },
                  description:
                    '这是一个Operator Demo，生成并维护指定数目的busybox容器，没有实际用途',
                  installModes: [
                    {
                      type: 'OwnNamespace',
                      supported: true,
                    },
                    {
                      type: 'SingleNamespace',
                      supported: true,
                    },
                    {
                      type: 'MultiNamespace',
                      supported: true,
                    },
                    {
                      type: 'AllNamespaces',
                      supported: true,
                    },
                  ],
                  customresourcedefinitions: {
                    owned: [
                      {
                        name: 'podsets.app.example.com',
                        version: 'v1alpha1',
                        kind: 'PodSet',
                        displayName: 'PodSet',
                        description: '创建PodSet实例',
                      },
                    ],
                  },
                  apiservicedefinitions: {},
                },
              },
            ],
            defaultChannel: 'version-1',
          },
        },
      ],
    });
  }

  listSubscriptions() {
    return Promise.resolve({
      apiVersion: 'operators.coreos.com/v1alpha1',
      items: [
        {
          apiVersion: 'operators.coreos.com/v1alpha1',
          kind: 'Subscription',
          metadata: {
            annotations: {
              'kubectl.kubernetes.io/last-applied-configuration':
                '{"apiVersion":"operators.coreos.com/v1alpha1","kind":"Subscription","metadata":{"annotations":{},"name":"podset","namespace":"ck"},"spec":{"channel":"version-1","installPlanApproval":"Automatic","name":"podset","source":"my-operator-catalog","sourceNamespace":"olm","startingCSV":"podset-operator.v0.1.0"}}\n',
            },
            creationTimestamp: '2019-09-02T03:41:17Z',
            generation: 1,
            name: 'podset',
            namespace: 'ck',
            resourceVersion: '1438768',
            selfLink: '/apis/operators.coreos.com/v1alpha1/namespaces/ck/subscriptions/podset',
            uid: '349fff7e-e1b9-43c0-863a-d06fafb1da57',
          },
          spec: {
            channel: 'version-1',
            installPlanApproval: 'Automatic',
            name: 'podset',
            source: 'my-operator-catalog',
            sourceNamespace: 'olm',
            startingCSV: 'podset-operator.v0.1.0',
          },
          status: {
            catalogHealth: [
              {
                catalogSourceRef: {
                  apiVersion: 'operators.coreos.com/v1alpha1',
                  kind: 'CatalogSource',
                  name: 'my-operator-catalog',
                  namespace: 'olm',
                  resourceVersion: '1436542',
                  uid: 'b72447d1-c677-4be1-a38b-bf3bfbb6d675',
                },
                healthy: true,
                lastUpdated: '2019-09-02T03:41:17Z',
              },
            ],
            conditions: [
              {
                lastTransitionTime: '2019-09-02T03:41:17Z',
                message: 'all available catalogsources are healthy',
                reason: 'AllCatalogSourcesHealthy',
                status: 'False',
                type: 'CatalogSourcesUnhealthy',
              },
            ],
            currentCSV: 'podset-operator.v0.1.0',
            installPlanRef: {
              apiVersion: 'operators.coreos.com/v1alpha1',
              kind: 'InstallPlan',
              name: 'install-7zlhx',
              namespace: 'ck',
              resourceVersion: '1438715',
              uid: '405de947-b7a6-4699-905e-827851550f1d',
            },
            installedCSV: 'podset-operator.v0.1.0',
            installplan: {
              apiVersion: 'operators.coreos.com/v1alpha1',
              kind: 'InstallPlan',
              name: 'install-7zlhx',
              uuid: '405de947-b7a6-4699-905e-827851550f1d',
            },
            lastUpdated: '2019-09-02T03:41:20Z',
            state: 'AtLatestKnown',
          },
        },
        {
          apiVersion: 'operators.coreos.com/v1alpha1',
          kind: 'Subscription',
          metadata: {
            creationTimestamp: '2019-09-04T07:18:46Z',
            generation: 1,
            name: 'podset',
            namespace: 'operators',
            resourceVersion: '2157222',
            selfLink:
              '/apis/operators.coreos.com/v1alpha1/namespaces/operators/subscriptions/podset',
            uid: '3a0808f1-c0a9-464f-9339-e975f42c2108',
          },
          spec: {
            channel: 'version-1',
            installPlanApproval: 'Automatic',
            name: 'podset',
            source: 'my-operator-catalog',
            sourceNamespace: 'olm',
            startingCSV: 'podset-operator.v0.1.0',
          },
          status: {
            catalogHealth: [
              {
                catalogSourceRef: {
                  apiVersion: 'operators.coreos.com/v1alpha1',
                  kind: 'CatalogSource',
                  name: 'my-operator-catalog',
                  namespace: 'olm',
                  resourceVersion: '2156408',
                  uid: 'b72447d1-c677-4be1-a38b-bf3bfbb6d675',
                },
                healthy: true,
                lastUpdated: '2019-09-04T07:18:46Z',
              },
            ],
            conditions: [
              {
                lastTransitionTime: '2019-09-04T07:18:46Z',
                message: 'all available catalogsources are healthy',
                reason: 'AllCatalogSourcesHealthy',
                status: 'False',
                type: 'CatalogSourcesUnhealthy',
              },
            ],
            currentCSV: 'podset-operator.v0.1.0',
            installPlanRef: {
              apiVersion: 'operators.coreos.com/v1alpha1',
              kind: 'InstallPlan',
              name: 'install-5nlvw',
              namespace: 'operators',
              resourceVersion: '2157194',
              uid: 'de27e229-6fdc-4e25-8432-2a188eaa363e',
            },
            installedCSV: 'podset-operator.v0.1.0',
            installplan: {
              apiVersion: 'operators.coreos.com/v1alpha1',
              kind: 'InstallPlan',
              name: 'install-5nlvw',
              uuid: 'de27e229-6fdc-4e25-8432-2a188eaa363e',
            },
            lastUpdated: '2019-09-04T07:18:50Z',
            state: 'AtLatestKnown',
          },
        },
      ],
      kind: 'SubscriptionList',
      metadata: {
        continue: '',
        resourceVersion: '2157304',
        selfLink: '/apis/operators.coreos.com/v1alpha1/subscriptions',
      },
    });
  }
}

export default new OperatorService();
