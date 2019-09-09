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
        {
          metadata: {
            name: 'akka-cluster-operator',
            namespace: 'test',
            selfLink:
              '/apis/packages.operators.coreos.com/v1/namespaces/test/packagemanifests/akka-cluster-operator',
            creationTimestamp: '2019-09-05T07:10:38Z',
            labels: {
              catalog: 'operatorhubio-catalog',
              'catalog-namespace': 'olm',
              provider: 'Lightbend, Inc.',
              'provider-url': '',
            },
          },
          spec: {},
          status: {
            catalogSource: 'operatorhubio-catalog',
            catalogSourceDisplayName: 'Community Operators',
            catalogSourcePublisher: 'OperatorHub.io',
            catalogSourceNamespace: 'olm',
            provider: {
              name: 'Lightbend, Inc.',
            },
            packageName: 'akka-cluster-operator',
            channels: [
              {
                name: 'alpha',
                currentCSV: 'akka-cluster-operator.v0.0.1',
                currentCSVDesc: {
                  displayName: 'Akka Cluster Operator',
                  icon: [
                    {
                      base64data:
                        'PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NTggMjcwIj48dGl0bGU+YWtrYS1mdWxsLWNvbG9yPC90aXRsZT48ZyBpZD0iYWtrYS1mdWxsLWNvbG9yIj48cGF0aCBkPSJNMzQ5LjY0LDEwNS40NlY5My4zNGgxOS45MnY1OC40NGMwLDcuMTMsMS42Niw5Ljc5LDYuMTQsOS43OSwxLjE3LDAsMi42Ni0uMTcsNC4xNS0uMzN2MTYuMWEyOC43MSwyOC43MSwwLDAsMS05Ljc5LDEuMzNjLTQuODEsMC04LjYzLS44My0xMS42Mi0yLjY2YTE1LjQxLDE1LjQxLDAsMCwxLTYuODEtMTAuMTJDMzQ1LjgyLDE3NC42OCwzMzYuMiwxNzksMzIyLjkyLDE3OUEzOS43NCwzOS43NCwwLDAsMSwyOTMsMTY2LjM4Yy04LTguNDYtMTItMTguNzUtMTItMzEuMnM0LTIyLjc1LDEyLTMxLjA1YTM5Ljc3LDM5Ljc3LDAsMCwxLDI5Ljg4LTEyLjYxQzMzNi4zNiw5MS41MiwzNDYuNDksOTcuNDksMzQ5LjY0LDEwNS40NlptLTYsNDhhMjQuNDIsMjQuNDIsMCwwLDAsNy40Ny0xOC4yNiwyNC4zOSwyNC4zOSwwLDAsMC03LjQ3LTE4LjI2LDI0Ljc5LDI0Ljc5LDAsMCwwLTE4LjEtNy4zMSwyNCwyNCwwLDAsMC0xNy43Niw3LjMxYy00LjY1LDQuODEtNywxMS03LDE4LjI2czIuMzIsMTMuNDQsNywxOC4yNmEyNCwyNCwwLDAsMCwxNy43Niw3LjNBMjQuODIsMjQuODIsMCwwLDAsMzQzLjY3LDE1My40NFoiIGZpbGw9IiMwYjU1NjciLz48cGF0aCBkPSJNMzg4LjQ4LDE3N1Y2MS4zMWgxOS43NnY2Ny41NmwzMC44Ny0zNS41M0g0NjJsLTMyLjcsMzcuMzVMNDY1LjUxLDE3N0g0NDIuOTNsLTI2LjM5LTMzLjctOC4zLDkuM1YxNzdaIiBmaWxsPSIjMGI1NTY3Ii8+PHBhdGggZD0iTTQ3MC44MiwxNzdWNjEuMzFoMTkuNzV2NjcuNTZsMzAuODgtMzUuNTNoMjIuOTFsLTMyLjcsMzcuMzVMNTQ3Ljg0LDE3N0g1MjUuMjdsLTI2LjQtMzMuNy04LjMsOS4zVjE3N1oiIGZpbGw9IiMwYjU1NjciLz48cGF0aCBkPSJNNjA3Ljg3LDEwNS40NlY5My4zNGgxOS45MnY1OC40NGMwLDcuMTMsMS42Niw5Ljc5LDYuMTQsOS43OSwxLjE3LDAsMi42Ni0uMTcsNC4xNS0uMzN2MTYuMWEyOC43MSwyOC43MSwwLDAsMS05Ljc5LDEuMzNjLTQuODEsMC04LjYzLS44My0xMS42Mi0yLjY2YTE1LjQxLDE1LjQxLDAsMCwxLTYuODEtMTAuMTJjLTUuODEsOC43OS0xNS40MywxMy4xMS0yOC43MSwxMy4xMWEzOS43NCwzOS43NCwwLDAsMS0yOS44OC0xMi42MmMtOC04LjQ2LTEyLTE4Ljc1LTEyLTMxLjJzNC0yMi43NSwxMi0zMS4wNWEzOS43NywzOS43NywwLDAsMSwyOS44OC0xMi42MUM1OTQuNTksOTEuNTIsNjA0LjcyLDk3LjQ5LDYwNy44NywxMDUuNDZabS02LDQ4YTI0LjQyLDI0LjQyLDAsMCwwLDcuNDctMTguMjYsMjQuMzksMjQuMzksMCwwLDAtNy40Ny0xOC4yNiwyNC43OSwyNC43OSwwLDAsMC0xOC4xLTcuMzFBMjQsMjQsMCwwLDAsNTY2LDExNi45MmMtNC42NSw0LjgxLTcsMTEtNywxOC4yNnMyLjMyLDEzLjQ0LDcsMTguMjZhMjQsMjQsMCwwLDAsMTcuNzYsNy4zQTI0LjgyLDI0LjgyLDAsMCwwLDYwMS45LDE1My40NFoiIGZpbGw9IiMwYjU1NjciLz48cGF0aCBkPSJNMjMwLjI2LDIxMi44MmMzNS44OCwyOC42Nyw1OC45MS01NywxLjc0LTcyLjgyLTQ4LTEzLjI5LTk2LjMzLDkuNS0xNDQuNjYsNjIuNzRDODcuMzQsMjAyLjc0LDE3Ni42NywxNzAsMjMwLjI2LDIxMi44MloiIGZpbGw9IiMwYjU1NjciLz48cGF0aCBkPSJNODguMDgsMjAyYzM0LjQxLTM1LjY5LDkxLjY0LTc1LjUzLDE0NC45LTYwLjc1QTQ2LjA5LDQ2LjA5LDAsMCwxLDI1OS45LDE2MC42TDIwOS40OCw1OC43OGMtNy4yLTExLjQ2LTI1LjU4LTkuMTUtMzUuOTUtLjI2TDQwLjI5LDE3MC4wN2EyNy40LDI3LjQsMCwwLDAtMS41Niw0MC4xNWwwLDBhMjcuNCwyNy40LDAsMCwwLDM2LjUxLDJMODguMTQsMjAyWiIgZmlsbD0iIzE1YTljZSIvPjwvZz48L3N2Zz4=',
                      mediatype: 'image/svg+xml',
                    },
                  ],
                  version: '0.0.1',
                  provider: {
                    name: 'Lightbend, Inc.',
                  },
                  annotations: {
                    'alm-examples':
                      '[\n  {\n    "apiVersion": "app.lightbend.com/v1alpha1",\n    "kind": "AkkaCluster",\n    "metadata": {\n      "name": "akka-cluster-demo"\n    },\n    "spec": {\n      "replicas": 3,\n      "template": {\n        "spec": {\n          "containers": [\n            {\n              "name": "main",\n              "image": "lightbend-docker-registry.bintray.io/lightbend/akka-cluster-demo:1.0.2",\n              "readinessProbe": {\n                "httpGet": {\n                  "path": "/ready",\n                  "port": "management"\n                },\n                "periodSeconds": 10,\n                "failureThreshold": 10,\n                "initialDelaySeconds": 20\n              },\n              "livenessProbe": {\n                "httpGet": {\n                  "path": "/alive",\n                  "port": "management"\n                },\n                "periodSeconds": 10,\n                "failureThreshold": 10,\n                "initialDelaySeconds": 20\n              },\n              "ports": [\n                {\n                  "name": "http",\n                  "containerPort": 8080\n                },\n                {\n                  "name": "remoting",\n                  "containerPort": 2552\n                },\n                {\n                  "name": "management",\n                  "containerPort": 8558\n                }\n              ]\n            }\n          ]\n        }\n      }\n    }\n  }\n]',
                    capabilities: 'Seamless Upgrades',
                    categories: 'Application Runtime',
                    certified: 'false',
                    containerImage:
                      'lightbend-docker-registry.bintray.io/lightbend/akkacluster-operator:latest',
                    createdAt: '2019-06-28T15:23:00Z',
                    description: 'Run Akka Cluster applications on OpenShift.',
                    repository: 'https://github.com/lightbend/akka-cluster-operator',
                    support: 'Lightbend, Inc.',
                  },
                  description:
                    'The Akka Cluster Operator allows you to manage applications designed for\n[Akka Cluster](https://doc.akka.io/docs/akka/current/common/cluster.html).\nClustering with [Akka](https://doc.akka.io/docs/akka/current/guide/introduction.html) provides a\nfault-tolerant, decentralized, peer-to-peer based cluster\nfor building stateful, distributed applications with no single point of failure.\nDevelopers should use Akka Management v1.x or newer, with both Bootstrap and HTTP modules enabled.\nWhen deploying using the Akka Cluster Operator, only the `management port` needs to be defined.\nDefaults are provided by the Operator for all other required configuration.\nThe Akka Cluster Operator provides scalabililty control and membership status information\nfor deployed applications using Akka Cluster. As part of supervising membership of running clusters,\nthis Operator creates a pod-listing ServiceAccount, Role, and RoleBinding suitable for\neach application. See the project [Readme](https://github.com/lightbend/akka-cluster-operator/blob/master/README.md)\nfor more information and details.\nThis is an incubating project in alpha version.\n',
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
                        name: 'akkaclusters.app.lightbend.com',
                        version: 'v1alpha1',
                        kind: 'AkkaCluster',
                        displayName: 'Akka Cluster',
                        description:
                          'An example Akka Cluster app that provides cluster visualization.',
                        resources: [
                          {
                            name: '',
                            kind: 'ServiceAccount',
                            version: 'v1',
                          },
                          {
                            name: '',
                            kind: 'Role',
                            version: 'v1',
                          },
                          {
                            name: '',
                            kind: 'RoleBinding',
                            version: 'v1',
                          },
                          {
                            name: '',
                            kind: 'Deployment',
                            version: 'v1',
                          },
                          {
                            name: '',
                            kind: 'ReplicaSet',
                            version: 'v1',
                          },
                          {
                            name: '',
                            kind: 'Pods',
                            version: 'v1',
                          },
                        ],
                        statusDescriptors: [
                          {
                            path: 'cluster',
                            displayName: 'Cluster',
                            description: 'Information on the cluster',
                          },
                          {
                            path: 'lastUpdate',
                            displayName: 'Last Update',
                            description: 'The last time the status changed',
                          },
                          {
                            path: 'managementHost',
                            displayName: 'Management Host',
                            description:
                              'The host of the (host,port) pair used to obtain the cluster status',
                          },
                          {
                            path: 'managementPort',
                            displayName: 'Management Port',
                            description:
                              'The port of the (host,port) pair used to obtain the cluster status',
                          },
                        ],
                        specDescriptors: [
                          {
                            path: 'replicas',
                            displayName: 'Replica Count',
                            description: 'The desired number of pod instances in the Akka Cluster',
                          },
                          {
                            path: 'template',
                            displayName: 'Template',
                            description: 'The template used to form the cluster',
                          },
                        ],
                      },
                    ],
                  },
                  apiservicedefinitions: {},
                },
              },
            ],
            defaultChannel: 'alpha',
          },
        },
        {
          metadata: {
            name: 'appsody-operator',
            namespace: 'test',
            selfLink:
              '/apis/packages.operators.coreos.com/v1/namespaces/test/packagemanifests/appsody-operator',
            creationTimestamp: '2019-09-05T07:10:38Z',
            labels: {
              catalog: 'operatorhubio-catalog',
              'catalog-namespace': 'olm',
              provider: 'Appsody',
              'provider-url': '',
            },
          },
          spec: {},
          status: {
            catalogSource: 'operatorhubio-catalog',
            catalogSourceDisplayName: 'Community Operators',
            catalogSourcePublisher: 'OperatorHub.io',
            catalogSourceNamespace: 'olm',
            provider: {
              name: 'Appsody',
            },
            packageName: 'appsody-operator',
            channels: [
              {
                name: 'beta',
                currentCSV: 'appsody-operator.v0.1.0',
                currentCSVDesc: {
                  displayName: 'Appsody Operator',
                  icon: [
                    {
                      base64data:
                        'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1Ni43MSA1MC43NSI+PGRlZnM+PHN0eWxlPi5he2lzb2xhdGlvbjppc29sYXRlO30uYntvcGFjaXR5OjAuODt9LmIsLmV7bWl4LWJsZW5kLW1vZGU6bXVsdGlwbHk7fS5je2ZpbGw6I2VkOGUwMDt9LmR7ZmlsbDojYzQzMDJmO30uZXtmaWxsOiNhZjFmNjQ7b3BhY2l0eTowLjg1O308L3N0eWxlPjwvZGVmcz48dGl0bGU+QXNzZXQgMjwvdGl0bGU+PGcgY2xhc3M9ImEiPjxnIGNsYXNzPSJiIj48cGF0aCBjbGFzcz0iYyIgZD0iTTI1Ljg4LjI4Yy0yLjUtLjgxLTUuNTguMTQtOC42MywzLjA2TDMuODcsMTYuMTdDLTIuMjIsMjItMSwyOC44MSw2LjYyLDMxLjI3bDE2LjcsNS40MWM3LjYxLDIuNDYsMTIuNi0yLjMyLDExLjA4LTEwLjYyTDMxLjA4LDcuODJjLS43Ni00LjE1LTIuNjktNi43My01LjItNy41NFoiLz48L2c+PGcgY2xhc3M9ImIiPjxwYXRoIGNsYXNzPSJkIiBkPSJNMzcuOTQsMy4xNEExNS43MywxNS43MywwLDAsMCwzMi41NSw0LjZMMTQuNjYsMTIuNzNjLTQuNTcsMi4wNy03LjMxLDUuMjYtNy43Miw5LS4zOSwzLjUyLDEuNDIsNyw1LjA4LDkuNzRsMTUsMTEuMzFhMTIuMjgsMTIuMjgsMCwwLDAsOC4wNiwyLjhjNC43Ny0uMzEsOC4yOS00LjM1LDkuMi0xMC41M2wyLjg0LTE5LjQ0QzQ4LjEyLDksNDUuNTEsNiw0My44Nyw0Ljc1YTguNzksOC43OSwwLDAsMC01LjkzLTEuNjFaIi8+PC9nPjxwYXRoIGNsYXNzPSJlIiBkPSJNMzMuOCw1MC43MWMtMi45My0uMzMtNS41Ny0yLjM5LTcuNDktNS44OEwxNywyNy44Yy0yLjExLTMuODMtMi4zLTcuNDYtLjU0LTEwLjIyczUuMjEtNC4yNiw5Ljc2LTQuMjhsMjAuMjctLjA3YzQuNTYsMCw3LjkxLDEuNSw5LjQyLDQuMjVzMSw2LjM5LTEuNDUsMTAuMjNMNDMuNDksNDQuOGMtMi40NCwzLjgzLTUuNTgsNS45NC04LjgzLDZBNi4xMiw2LjEyLDAsMCwxLDMzLjgsNTAuNzFaIi8+PC9nPjwvc3ZnPg==',
                      mediatype: 'image/svg+xml',
                    },
                  ],
                  version: '0.1.0',
                  provider: {
                    name: 'Appsody',
                  },
                  annotations: {
                    'alm-examples':
                      '[{"apiVersion":"appsody.dev/v1beta1","kind":"AppsodyApplication","metadata":{"name":"example-appsodyapplication"},"spec":{"applicationImage":"APPLICATION_IMAGE","stack":"java-microprofile"}}]',
                    capabilities: 'Seamless Upgrades',
                    categories: 'Application Runtime',
                    certified: 'true',
                    containerImage: 'appsody/application-operator:0.1.0',
                    createdAt: '2019-08-23 09:00:00',
                    description: 'Deploys Appsody based applications',
                    repository: 'https://github.com/appsody/appsody-operator',
                    support: 'Appsody',
                  },
                  description:
                    'The Appsody Operator allows easy deployment of applications developed with [Appsody](https://appsody.dev) to Kubernetes environments. The operator provides the following key features:\n\n#### Routing\n\nExpose your application to external users via a single toggle.\n\n#### High Availability\n\nRun multiple instances of your application for high availability. Either specify a static number of replicas or easily configure auto scaling to create (and delete) instances based on resource consumption.\n\n#### Persistence\n\nEnable persistence for your application by specifying storage requirements.\n\n#### Knative\n\nDeploy your serverless application on [Knative](https://knative.dev) using a single toggle.\n\nSee our [**documentation**](https://github.com/appsody/appsody-operator/tree/master/doc/) for more information.\n',
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
                        name: 'appsodyapplications.appsody.dev',
                        version: 'v1beta1',
                        kind: 'AppsodyApplication',
                        displayName: 'Appsody Application',
                        description: 'Describes application deployment',
                        resources: [
                          {
                            name: '',
                            kind: 'Deployment',
                            version: '',
                          },
                          {
                            name: '',
                            kind: 'StatefulSet',
                            version: '',
                          },
                          {
                            name: '',
                            kind: 'Service',
                            version: '',
                          },
                          {
                            name: '',
                            kind: 'Route',
                            version: '',
                          },
                          {
                            name: '',
                            kind: 'HorizontalPodAutoscaler',
                            version: '',
                          },
                        ],
                        statusDescriptors: [
                          {
                            path: 'conditions',
                            displayName: 'Status conditions',
                            description: 'status conditions',
                            'x-descriptors': ['urn:alm:descriptor:io.kubernetes.conditions'],
                          },
                        ],
                        specDescriptors: [
                          {
                            path: 'stack',
                            displayName: 'Stack',
                            description: 'application stack',
                            'x-descriptors': ['urn:alm:descriptor:com.tectonic.ui:label'],
                          },
                          {
                            path: 'applicationImage',
                            displayName: 'Application Image',
                            description: 'application image to be installed',
                            'x-descriptors': ['urn:alm:descriptor:com.tectonic.ui:text'],
                          },
                          {
                            path: 'pullPolicy',
                            displayName: 'Pull Policy',
                            description: 'image pull policy for container image',
                            'x-descriptors': ['urn:alm:descriptor:com.tectonic.ui:imagePullPolicy'],
                          },
                          {
                            path: 'replicas',
                            displayName: 'Replicas',
                            description: 'number of pods to create',
                            'x-descriptors': ['urn:alm:descriptor:com.tectonic.ui:podCount'],
                          },
                          {
                            path: 'expose',
                            displayName: 'Expose',
                            description: 'automatically create HTTP Route',
                            'x-descriptors': ['urn:alm:descriptor:com.tectonic.ui:booleanSwitch'],
                          },
                          {
                            path: 'resourceConstraints',
                            displayName: 'Resource Requirements',
                            description: 'resource requirements for cpu and memory',
                            'x-descriptors': [
                              'urn:alm:descriptor:com.tectonic.ui:resourceRequirements',
                            ],
                          },
                          {
                            path: 'service.port',
                            displayName: 'Service Port',
                            description: 'port to use for kubernetes service',
                            'x-descriptors': ['urn:alm:descriptor:com.tectonic.ui:number'],
                          },
                          {
                            path: 'service.type',
                            displayName: 'Service Type',
                            description: 'type to use for kubernetes service',
                            'x-descriptors': ['urn:alm:descriptor:com.tectonic.ui:text'],
                          },
                          {
                            path: 'autoscaling',
                            displayName: 'Autoscaling',
                            description: 'horizontal pod autoscaling',
                            'x-descriptors': [
                              'urn:alm:descriptor:com.tectonic.ui:fieldGroup:label',
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  apiservicedefinitions: {},
                },
              },
            ],
            defaultChannel: 'beta',
          },
        },
        {
          metadata: {
            name: 'aqua',
            namespace: 'test',
            selfLink:
              '/apis/packages.operators.coreos.com/v1/namespaces/test/packagemanifests/aqua',
            creationTimestamp: '2019-09-05T07:10:38Z',
            labels: {
              catalog: 'operatorhubio-catalog',
              'catalog-namespace': 'olm',
              provider: 'Aqua Security, Inc.',
              'provider-url': '',
            },
          },
          spec: {},
          status: {
            catalogSource: 'operatorhubio-catalog',
            catalogSourceDisplayName: 'Community Operators',
            catalogSourcePublisher: 'OperatorHub.io',
            catalogSourceNamespace: 'olm',
            provider: {
              name: 'Aqua Security, Inc.',
            },
            packageName: 'aqua',
            channels: [
              {
                name: 'alpha',
                currentCSV: 'aqua-operator.v0.0.2',
                currentCSVDesc: {
                  displayName: 'Aqua Security Operator',
                  icon: [
                    {
                      base64data:
                        'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIzLjAuMiwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDAgMTAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6I0YwREUzNDt9Cgkuc3Qxe2ZpbGw6I0Y5QUU0MTt9Cgkuc3Qye2ZpbGw6Izk5RDVFQjt9Cgkuc3Qze2ZpbGw6IzAyQjBENDt9Cgkuc3Q0e2ZpbGw6I0Y1OTMyMDt9Cgkuc3Q1e2ZpbGw6IzA5ODA5QTt9Cjwvc3R5bGU+CjxnPgoJPHBvbHlnb24gY2xhc3M9InN0MCIgcG9pbnRzPSI1MCwyLjEgMjUuNSwyNi4xIDc0LjUsMjYuMSA3NC41LDIuMSAJIi8+Cgk8cG9seWdvbiBjbGFzcz0ic3QxIiBwb2ludHM9Ijc0LjUsNzMuOSA5OSw1MCA5OSwyNi4xIDc0LjUsMjYuMSAJIi8+Cgk8cG9seWdvbiBjbGFzcz0ic3QyIiBwb2ludHM9IjI1LjUsNzMuOSAyNS41LDk3LjkgNTAsOTcuOSA3NC41LDczLjkgCSIvPgoJPHBvbHlnb24gY2xhc3M9InN0MyIgcG9pbnRzPSIxLDUwIDEsNzMuOSAyNS41LDczLjkgMjUuNSwyNi4xIAkiLz4KCTxyZWN0IHg9Ijc0LjUiIHk9IjIuMSIgY2xhc3M9InN0NCIgd2lkdGg9IjI0LjUiIGhlaWdodD0iMjMuOSIvPgoJPHJlY3QgeD0iMSIgeT0iNzMuOSIgY2xhc3M9InN0NSIgd2lkdGg9IjI0LjUiIGhlaWdodD0iMjMuOSIvPgo8L2c+Cjwvc3ZnPgo=',
                      mediatype: 'image/svg+xml',
                    },
                  ],
                  version: '0.0.2',
                  provider: {
                    name: 'Aqua Security, Inc.',
                  },
                  annotations: {
                    'alm-examples':
                      '[\n  {\n    "apiVersion": "operator.aquasec.com/v1alpha1",\n    "kind": "AquaCsp",\n    "metadata": {\n      "name": "aqua"\n    },\n    "spec": {\n      "requirements": true,\n      "password": "password",\n      "rbac": {\n        "enable": true,\n        "privileged": true\n      },\n      "registry": {\n        "url": "registry.aquasec.com",\n        "username": "example@gmail.com",\n        "password": "",\n        "email": "example@gmail.com"\n      },\n      "database": {\n        "replicas": 1,\n        "service": "ClusterIP",\n        "image": {\n          "repository": "database",\n          "registry": "registry.aquasec.com",\n          "tag": "4.0",\n          "pullPolicy": "IfNotPresent"\n        }\n      },\n      "gateway": {\n        "replicas": 1,\n        "service": "ClusterIP",\n        "image": {\n          "repository": "gateway",\n          "registry": "registry.aquasec.com",\n          "tag": "4.0",\n          "pullPolicy": "IfNotPresent"\n        }\n      },\n      "server": {\n        "replicas": 1,\n        "service": "LoadBalancer",\n        "image": {\n          "repository": "console",\n          "registry": "registry.aquasec.com",\n          "tag": "4.0",\n          "pullPolicy": "IfNotPresent"\n        }\n      },\n      "scanner": {\n        "deploy": {\n          "replicas": 1,\n          "service": "ClusterIP",\n          "image": {\n            "repository": "scanner",\n            "registry": "registry.aquasec.com",\n            "tag": "4.0",\n            "pullPolicy": "IfNotPresent"\n          }\n        },\n        "min": 1,\n        "max": 5,\n        "imagesPerScanner": 100\n      },\n      "adminPassword": "Password1",\n      "licenseToken": null,\n      "clustermode": false,\n      "ssl": false,\n      "auditSsl": false\n    }\n  },\n  {\n    "apiVersion": "operator.aquasec.com/v1alpha1",\n    "kind": "AquaDatabase",\n    "metadata": {\n      "name": "aqua"\n    },\n    "spec": {\n      "requirements": true,\n      "password": "password",\n      "registry": {\n        "url": "registry.aquasec.com",\n        "username": "example@gmail.com",\n        "password": "",\n        "email": "example@gmail.com"\n      },\n      "deploy": {\n        "replicas": 1,\n        "service": "ClusterIP",\n        "image": {\n          "repository": "database",\n          "registry": "registry.aquasec.com",\n          "tag": "4.0",\n          "pullpolicy": "IfNotPresent"\n        }\n      }\n    }\n  },\n  {\n    "apiVersion": "operator.aquasec.com/v1alpha1",\n    "kind": "AquaEnforcer",\n    "metadata": {\n      "name": "aqua"\n    },\n    "spec": {\n      "requirements": false,\n      "serviceAccount": "aqua-sa",\n      "token": "tests",\n      "rbac": {\n        "enable": false,\n        "privileged": true\n      },\n      "deploy": {\n        "image": {\n          "repository": "enforcer",\n          "registry": "registry.aquasec.com",\n          "tag": "4.0",\n          "pullPolicy": "IfNotPresent"\n        }\n      },\n      "gateway": {\n        "host": "aqua-gateway-svc",\n        "port": 3622\n      },\n      "sendingHostImages": false,\n      "runcInterception": false\n    }\n  },\n  {\n    "apiVersion": "operator.aquasec.com/v1alpha1",\n    "kind": "AquaGateway",\n    "metadata": {\n      "name": "aqua"\n    },\n    "spec": {\n      "requirements": false,\n      "serviceAccount": "aqua-sa",\n      "dbSecretName": "aqua-database-password",\n      "dbSecretKey": "db-password",\n      "deploy": {\n        "replicas": 1,\n        "service": "ClusterIP",\n        "image": {\n          "repository": "gateway",\n          "registry": "registry.aquasec.com",\n          "tag": "3.5",\n          "pullpolicy": "IfNotPresent"\n        }\n      },\n      "aquaDb": "aqua-database",\n      "ssl": false,\n      "auditSsl": false\n    }\n  },\n  {\n    "apiVersion": "operator.aquasec.com/v1alpha1",\n    "kind": "AquaScanner",\n    "metadata": {\n      "name": "aqua"\n    },\n    "spec": {\n      "requirements": false,\n      "serviceAccount": "aqua-sa",\n      "deploy": {\n        "replicas": 1,\n        "service": "ClusterIP",\n        "image": {\n          "repository": "scanner",\n          "registry": "registry.aquasec.com",\n          "tag": "4.0",\n          "pullPolicy": "IfNotPresent"\n        }\n      },\n      "login": {\n        "username": "administrator",\n        "password": "Password1",\n        "host": "http://aqua-server-svc:8080"\n      }\n    }\n  },\n  {\n    "apiVersion": "operator.aquasec.com/v1alpha1",\n    "kind": "AquaServer",\n    "metadata": {\n      "name": "aqua"\n    },\n    "spec": {\n      "requirements": false,\n      "add": false,\n      "serviceAccount": "aqua-sa",\n      "dbSecretName": "aqua-database-password",\n      "dbSecretKey": "db-password",\n      "rbac": {\n        "enable": true,\n        "privileged": true\n      },\n      "deploy": {\n        "replicas": 1,\n        "service": "LoadBalancer",\n        "image": {\n          "repository": "console",\n          "registry": "registry.aquasec.com",\n          "tag": "3.5",\n          "pullPolicy": "IfNotPresent"\n        }\n      },\n      "aquaDb": "aqua-database",\n      "adminPassword": "Password1",\n      "licenseToken": null,\n      "clusterMode": true,\n      "ssl": false,\n      "auditSsl": false,\n      "dockerless": false\n    }\n  }\n]',
                    capabilities: 'Basic Install',
                    categories: 'Security',
                    certified: 'false',
                    containerImage: 'aquasec/aqua-operator:0.0.2',
                    createdAt: '2019-03-21 08:00:00',
                    description:
                      'The Aqua Security Operator runs within Kubernetes cluster and provides a means to deploy and manage Aqua Security cluster and components.',
                    repository: 'https://github.com/aquasecurity/aqua-operator',
                    support: 'Aqua Security, Inc.',
                  },
                  description:
                    'The Aqua Security Operator runs within a Kubernetes cluster, and provides a means to deploy and manage the Aqua Security cluster and components\n* Server (sometimes called “console”)\n* Database (not recommended for production environments)\n* Gateway\n* Enforcer (sometimes called “agent”)\n* Scanner\n* CSP (package containing the Server, Database, and Gateway - not supported, and not for production environments)\nUse the aqua-operator to - \n* Deploy Aqua Security components on Kubernetes\n* Scale up Aqua Security components with extra replicas\n* Assign metadata tags to Aqua Security components\n* Automatically scale the number of Aqua scanners according to the number of images in the scan queue\n## Before You Begin Using the Operator CRDs\nObtain access to the Aqua registry https://www.aquasec.com/about-us/contact-us/\n### Kubernetes 1.11, 1.12, 1.13 or 1.14\nThe operator in Kubernetes needs to be able to create the all the requirements by passing the parameter **requirements** as `true`.\nYou can also create the requirements\n* Service account with pull permissions from the Aqua Docker registry\n* Secret for the Docker registry \n* Secret for the database\n## After the Installation\nOnce the operator is installed in the cluster, you now can use the CRDs to install the Aqua cluster and components.',
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
                      supported: false,
                    },
                  ],
                  customresourcedefinitions: {
                    owned: [
                      {
                        name: 'aquacsps.operator.aquasec.com',
                        version: 'v1alpha1',
                        kind: 'AquaCsp',
                        displayName: 'AquaCsp',
                        description: 'Aqua Security CSP Deployment with Aqua Operator',
                      },
                      {
                        name: 'aquadatabases.operator.aquasec.com',
                        version: 'v1alpha1',
                        kind: 'AquaDatabase',
                        displayName: 'AquaDatabase',
                        description: 'Aqua Security Database Deployment with Aqua Operator',
                      },
                      {
                        name: 'aquaenforcers.operator.aquasec.com',
                        version: 'v1alpha1',
                        kind: 'AquaEnforcer',
                        displayName: 'AquaEnforcer',
                        description: 'Aqua Security Enforcer Deployment with Aqua Operator',
                      },
                      {
                        name: 'aquagateways.operator.aquasec.com',
                        version: 'v1alpha1',
                        kind: 'AquaGateway',
                        displayName: 'AquaGateway',
                        description: 'Aqua Security Gateway Deployment with Aqua Operator',
                      },
                      {
                        name: 'aquascanners.operator.aquasec.com',
                        version: 'v1alpha1',
                        kind: 'AquaScanner',
                        displayName: 'AquaScanner',
                        description: 'Aqua Security Scanner Deployment with Aqua Operator',
                      },
                      {
                        name: 'aquaservers.operator.aquasec.com',
                        version: 'v1alpha1',
                        kind: 'AquaServer',
                        displayName: 'AquaServer',
                        description: 'Aqua Security Server Deployment with Aqua Operator',
                      },
                    ],
                  },
                  apiservicedefinitions: {},
                },
              },
            ],
            defaultChannel: 'alpha',
          },
        },
        {
          metadata: {
            name: 'atlasmap-operator',
            namespace: 'test',
            selfLink:
              '/apis/packages.operators.coreos.com/v1/namespaces/test/packagemanifests/atlasmap-operator',
            creationTimestamp: '2019-09-05T07:10:38Z',
            labels: {
              catalog: 'operatorhubio-catalog',
              'catalog-namespace': 'olm',
              provider: 'AtlasMap',
              'provider-url': '',
            },
          },
          spec: {},
          status: {
            catalogSource: 'operatorhubio-catalog',
            catalogSourceDisplayName: 'Community Operators',
            catalogSourcePublisher: 'OperatorHub.io',
            catalogSourceNamespace: 'olm',
            provider: {
              name: 'AtlasMap',
            },
            packageName: 'atlasmap-operator',
            channels: [
              {
                name: 'alpha',
                currentCSV: 'atlasmap-operator.v0.1.0',
                currentCSVDesc: {
                  displayName: 'AtlasMap Operator',
                  icon: [
                    {
                      base64data:
                        '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',
                      mediatype: 'image/png',
                    },
                  ],
                  version: '0.1.0',
                  provider: {
                    name: 'AtlasMap',
                  },
                  annotations: {
                    'alm-examples':
                      '[{\n  "apiVersion":"atlasmap.io/v1alpha1",\n  "kind":"AtlasMap",\n  "metadata": {\n    "name":"example-atlasmap"\n  },\n  "spec": {\n    "replicas":1\n  }\n}]',
                    capabilities: 'Seamless Upgrades',
                    categories: 'Integration \u0026 Delivery',
                    certified: 'false',
                    containerImage: 'docker.io/atlasmap/atlasmap-operator',
                    createdAt: '2019-06-10 06:42:43',
                    description:
                      'AtlasMap is a data mapping solution with an interactive web based user interface, that simplifies configuring integrations between Java, XML, and JSON data sources',
                    repository: 'https://github.com/atlasmap/atlasmap-operator',
                    support: 'AtlasMap',
                  },
                  description:
                    'AtlasMap is a data mapping solution with an interactive web based user interface, that simplifies configuring integrations between Java, XML, and JSON data sources.\n\nThe AtlasMap operator simplifies the deployment of AtlasMap on OpenShift / Kubernetes clusters.\n\nFor further information about AtlasMap and the operator, visit the documentation.\n\n* [AtlasMap documentation](https://www.atlasmap.io/)\n* [AtlasMap operator documentation](https://github.com/atlasmap/atlasmap-operator)\n',
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
                        name: 'atlasmaps.atlasmap.io',
                        version: 'v1alpha1',
                        kind: 'AtlasMap',
                        displayName: 'AtlasMap',
                        description: 'A running AtlasMap instance',
                        statusDescriptors: [
                          {
                            path: 'URL',
                            displayName: 'URL',
                            description: 'URL of the AtlasMap instance',
                          },
                          {
                            path: 'image',
                            displayName: 'Image',
                            description: 'Image used for the AtlasMap containers',
                          },
                        ],
                        specDescriptors: [
                          {
                            path: 'replicas',
                            displayName: 'Size',
                            description: 'Desired number of AtlasMap Pods for the cluster',
                          },
                        ],
                      },
                    ],
                  },
                  apiservicedefinitions: {},
                },
              },
            ],
            defaultChannel: 'alpha',
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

  getPackageManifest() {
    return Promise.resolve({
      kind: 'PackageManifestList',
      apiVersion: 'packages.operators.coreos.com/v1',
      metadata: {
        selfLink: '/apis/packages.operators.coreos.com/v1/namespaces/olm/packagemanifests',
      },
      items: [
        {
          metadata: {
            name: 'appsody-operator',
            namespace: 'olm',
            selfLink:
              '/apis/packages.operators.coreos.com/v1/namespaces/olm/packagemanifests/appsody-operator',
            creationTimestamp: '2019-09-05T07:10:38Z',
            labels: {
              catalog: 'operatorhubio-catalog',
              'catalog-namespace': 'olm',
              provider: 'Appsody',
              'provider-url': '',
            },
          },
          spec: {},
          status: {
            catalogSource: 'operatorhubio-catalog',
            catalogSourceDisplayName: 'Community Operators',
            catalogSourcePublisher: 'OperatorHub.io',
            catalogSourceNamespace: 'olm',
            provider: {
              name: 'Appsody',
            },
            packageName: 'appsody-operator',
            channels: [
              {
                name: 'beta',
                currentCSV: 'appsody-operator.v0.1.0',
                currentCSVDesc: {
                  displayName: 'Appsody Operator',
                  icon: [
                    {
                      base64data:
                        'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1Ni43MSA1MC43NSI+PGRlZnM+PHN0eWxlPi5he2lzb2xhdGlvbjppc29sYXRlO30uYntvcGFjaXR5OjAuODt9LmIsLmV7bWl4LWJsZW5kLW1vZGU6bXVsdGlwbHk7fS5je2ZpbGw6I2VkOGUwMDt9LmR7ZmlsbDojYzQzMDJmO30uZXtmaWxsOiNhZjFmNjQ7b3BhY2l0eTowLjg1O308L3N0eWxlPjwvZGVmcz48dGl0bGU+QXNzZXQgMjwvdGl0bGU+PGcgY2xhc3M9ImEiPjxnIGNsYXNzPSJiIj48cGF0aCBjbGFzcz0iYyIgZD0iTTI1Ljg4LjI4Yy0yLjUtLjgxLTUuNTguMTQtOC42MywzLjA2TDMuODcsMTYuMTdDLTIuMjIsMjItMSwyOC44MSw2LjYyLDMxLjI3bDE2LjcsNS40MWM3LjYxLDIuNDYsMTIuNi0yLjMyLDExLjA4LTEwLjYyTDMxLjA4LDcuODJjLS43Ni00LjE1LTIuNjktNi43My01LjItNy41NFoiLz48L2c+PGcgY2xhc3M9ImIiPjxwYXRoIGNsYXNzPSJkIiBkPSJNMzcuOTQsMy4xNEExNS43MywxNS43MywwLDAsMCwzMi41NSw0LjZMMTQuNjYsMTIuNzNjLTQuNTcsMi4wNy03LjMxLDUuMjYtNy43Miw5LS4zOSwzLjUyLDEuNDIsNyw1LjA4LDkuNzRsMTUsMTEuMzFhMTIuMjgsMTIuMjgsMCwwLDAsOC4wNiwyLjhjNC43Ny0uMzEsOC4yOS00LjM1LDkuMi0xMC41M2wyLjg0LTE5LjQ0QzQ4LjEyLDksNDUuNTEsNiw0My44Nyw0Ljc1YTguNzksOC43OSwwLDAsMC01LjkzLTEuNjFaIi8+PC9nPjxwYXRoIGNsYXNzPSJlIiBkPSJNMzMuOCw1MC43MWMtMi45My0uMzMtNS41Ny0yLjM5LTcuNDktNS44OEwxNywyNy44Yy0yLjExLTMuODMtMi4zLTcuNDYtLjU0LTEwLjIyczUuMjEtNC4yNiw5Ljc2LTQuMjhsMjAuMjctLjA3YzQuNTYsMCw3LjkxLDEuNSw5LjQyLDQuMjVzMSw2LjM5LTEuNDUsMTAuMjNMNDMuNDksNDQuOGMtMi40NCwzLjgzLTUuNTgsNS45NC04LjgzLDZBNi4xMiw2LjEyLDAsMCwxLDMzLjgsNTAuNzFaIi8+PC9nPjwvc3ZnPg==',
                      mediatype: 'image/svg+xml',
                    },
                  ],
                  version: '0.1.0',
                  provider: {
                    name: 'Appsody',
                  },
                  annotations: {
                    'alm-examples':
                      '[{"apiVersion":"appsody.dev/v1beta1","kind":"AppsodyApplication","metadata":{"name":"example-appsodyapplication"},"spec":{"applicationImage":"APPLICATION_IMAGE","stack":"java-microprofile"}}]',
                    capabilities: 'Seamless Upgrades',
                    categories: 'Application Runtime',
                    certified: 'true',
                    containerImage: 'appsody/application-operator:0.1.0',
                    createdAt: '2019-08-23 09:00:00',
                    description: 'Deploys Appsody based applications',
                    repository: 'https://github.com/appsody/appsody-operator',
                    support: 'Appsody',
                  },
                  description:
                    'The Appsody Operator allows easy deployment of applications developed with [Appsody](https://appsody.dev) to Kubernetes environments. The operator provides the following key features:\n\n#### Routing\n\nExpose your application to external users via a single toggle.\n\n#### High Availability\n\nRun multiple instances of your application for high availability. Either specify a static number of replicas or easily configure auto scaling to create (and delete) instances based on resource consumption.\n\n#### Persistence\n\nEnable persistence for your application by specifying storage requirements.\n\n#### Knative\n\nDeploy your serverless application on [Knative](https://knative.dev) using a single toggle.\n\nSee our [**documentation**](https://github.com/appsody/appsody-operator/tree/master/doc/) for more information.\n',
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
                        name: 'appsodyapplications.appsody.dev',
                        version: 'v1beta1',
                        kind: 'AppsodyApplication',
                        displayName: 'Appsody Application',
                        description: 'Describes application deployment',
                        resources: [
                          {
                            name: '',
                            kind: 'Deployment',
                            version: '',
                          },
                          {
                            name: '',
                            kind: 'StatefulSet',
                            version: '',
                          },
                          {
                            name: '',
                            kind: 'Service',
                            version: '',
                          },
                          {
                            name: '',
                            kind: 'Route',
                            version: '',
                          },
                          {
                            name: '',
                            kind: 'HorizontalPodAutoscaler',
                            version: '',
                          },
                        ],
                        statusDescriptors: [
                          {
                            path: 'conditions',
                            displayName: 'Status conditions',
                            description: 'status conditions',
                            'x-descriptors': ['urn:alm:descriptor:io.kubernetes.conditions'],
                          },
                        ],
                        specDescriptors: [
                          {
                            path: 'stack',
                            displayName: 'Stack',
                            description: 'application stack',
                            'x-descriptors': ['urn:alm:descriptor:com.tectonic.ui:label'],
                          },
                          {
                            path: 'applicationImage',
                            displayName: 'Application Image',
                            description: 'application image to be installed',
                            'x-descriptors': ['urn:alm:descriptor:com.tectonic.ui:text'],
                          },
                          {
                            path: 'pullPolicy',
                            displayName: 'Pull Policy',
                            description: 'image pull policy for container image',
                            'x-descriptors': ['urn:alm:descriptor:com.tectonic.ui:imagePullPolicy'],
                          },
                          {
                            path: 'replicas',
                            displayName: 'Replicas',
                            description: 'number of pods to create',
                            'x-descriptors': ['urn:alm:descriptor:com.tectonic.ui:podCount'],
                          },
                          {
                            path: 'expose',
                            displayName: 'Expose',
                            description: 'automatically create HTTP Route',
                            'x-descriptors': ['urn:alm:descriptor:com.tectonic.ui:booleanSwitch'],
                          },
                          {
                            path: 'resourceConstraints',
                            displayName: 'Resource Requirements',
                            description: 'resource requirements for cpu and memory',
                            'x-descriptors': [
                              'urn:alm:descriptor:com.tectonic.ui:resourceRequirements',
                            ],
                          },
                          {
                            path: 'service.port',
                            displayName: 'Service Port',
                            description: 'port to use for kubernetes service',
                            'x-descriptors': ['urn:alm:descriptor:com.tectonic.ui:number'],
                          },
                          {
                            path: 'service.type',
                            displayName: 'Service Type',
                            description: 'type to use for kubernetes service',
                            'x-descriptors': ['urn:alm:descriptor:com.tectonic.ui:text'],
                          },
                          {
                            path: 'autoscaling',
                            displayName: 'Autoscaling',
                            description: 'horizontal pod autoscaling',
                            'x-descriptors': [
                              'urn:alm:descriptor:com.tectonic.ui:fieldGroup:label',
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  apiservicedefinitions: {},
                },
              },
            ],
            defaultChannel: 'beta',
          },
        },
      ],
    });
  }

  getOperatorGroup() {
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
            annotations: { 'olm.providedAPIs': '' },
            creationTimestamp: '2019-09-05T06:29:10Z',
            generation: 1,
            name: 'og-es',
            namespace: 'es',
            resourceVersion: '2572264',
            selfLink: '/apis/operators.coreos.com/v1/namespaces/es/operatorgroups/og-es',
            uid: '13b14ad8-ba13-42c8-96ad-c147ad87eecd',
          },
          spec: { targetNamespaces: ['es'] },
          status: { lastUpdated: '2019-09-05T06:29:10Z', namespaces: ['es'] },
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
            resourceVersion: '2630185',
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
            annotations: {
              'olm.providedAPIs':
                'KafkaCluster.v1alpha1.banzaicloud.banzaicloud.io,PodSet.v1alpha1.app.example.com',
            },
            creationTimestamp: '2019-08-30T02:35:33Z',
            generateName: 'test-',
            generation: 4,
            name: 'test-grfhb',
            namespace: 'test',
            resourceVersion: '4471663',
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
        resourceVersion: '4577705',
        selfLink: '/apis/operators.coreos.com/v1/operatorgroups',
      },
    });
  }
}

export default new OperatorService();
