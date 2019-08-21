import api, { APIService } from './api';

class IngressService {
  api: APIService;

  constructor() {
    this.api = api;
  }

  list() {
    return Promise.resolve({
      kind: 'IngressList',
      apiVersion: 'extensions/v1beta1',
      metadata: {
        selfLink: '/apis/extensions/v1beta1/namespaces/default/ingresses',
        resourceVersion: '1020673',
      },
      items: [
        {
          metadata: {
            name: 'example',
            namespace: 'default',
            selfLink:
              '/apis/extensions/v1beta1/namespaces/default/ingresses/example',
            uid: 'e8ab97bf-c234-11e9-84d7-005056b4d66c',
            resourceVersion: '613373',
            generation: 1,
            creationTimestamp: '2019-08-19T03:53:30Z',
          },
          spec: {
            rules: [
              {
                host: 'example.com',
                http: {
                  paths: [
                    {
                      path: '/testpath',
                      backend: {
                        serviceName: 'test',
                        servicePort: 80,
                      },
                    },
                  ],
                },
              },
            ],
          },
          status: {
            loadBalancer: {},
          },
        },
      ],
    });
  }

  get() {
    return Promise.resolve({
      kind: 'Ingress',
      apiVersion: 'extensions/v1beta1',
      metadata: {
        name: 'example',
        namespace: 'default',
        selfLink:
          '/apis/extensions/v1beta1/namespaces/default/ingresses/example',
        uid: 'e8ab97bf-c234-11e9-84d7-005056b4d66c',
        resourceVersion: '1074414',
        generation: 5,
        creationTimestamp: '2019-08-19T03:53:30Z',
        annotations: {
          sdf: 'adsf',
        },
      },
      spec: {
        tls: [
          {
            hosts: ['example.com'],
            secretName: 'router-certs',
          },
          {
            hosts: ['example1.com'],
            secretName: 'router-certs',
          },
        ],
        rules: [
          {
            host: 'example.com',
            http: {
              paths: [
                {
                  path: '/testpath',
                  backend: {
                    serviceName: 'test',
                    servicePort: 80,
                  },
                },
                {
                  path: '/testpath4',
                  backend: {
                    serviceName: 'tesst',
                    servicePort: 9090,
                  },
                },
              ],
            },
          },
          {
            host: 'example1.com',
            http: {
              paths: [
                {
                  path: '/testpath',
                  backend: {
                    serviceName: 'spring',
                    servicePort: 8080,
                  },
                },
              ],
            },
          },
        ],
      },
      status: {
        loadBalancer: {},
      },
    });
  }
}

export default new IngressService();
