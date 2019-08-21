import Vue from 'vue';

export default function getDefaultMenus() {
  return [
    {
      name: '应用部署',
      children: [
        {
          name: '应用',
          services: [
            {
              available: 'available',
              name: '应用',
              isDefault: true,
              createMessage:
                '部署您自己的应用。您可以使用构建好的应用镜像，快速完成应用的部署，部署动作将产生多个资源对象。',
              description:
                '应用是为实现特定业务目标而创建的一组相关联的资源对象，通常会包含 Deployment 或 Deployment Config、Service、Router 等。',
              help_url: Vue.filter('help_url')('app'),
              route: {
                name: 'console.applications',
              },
              deployRoute: {
                name: 'deploy.app',
              },
            },
          ],
        },
        {
          name: 'Deployment Config',
          services: [
            {
              available: 'available',
              name: 'Deployment Config',
              isDefault: true,
              createMessage:
                '您可以通过Yaml来定义 Deployment Config，并创建一个 Deployment Config 资源对象。',
              description:
                'Deployment为Pod 和 Replication Controller 提供声明式的更新。你只需要在 Deployment 中描述您想要的目标状态是什么，Deployment controller 就会帮您将 Pod 和 RC 的实际状态改变到您的目标状态。Deployment controller 就会帮您将 Pod 和 RC 的实际状态改变到您的目标状态。',
              help_url: Vue.filter('help_url')('deployment-config'),
              route: {
                name: 'resource.deployments.list',
              },
              deployRoute: {
                name: 'resource.deployments.list',
                query: {
                  dcCreate: true,
                },
              },
            },
          ],
        },
        {
          name: 'Deployment',
          services: [
            {
              available: 'available',
              name: 'Deployment',
              isDefault: true,
              createMessage:
                '您可以通过Yaml来定义 Deployment，并创建一个 Deployment 资源对象。',
              description:
                'Deployment为Pod和Replica Set（升级版的 Replication Controller）提供声明式的更新。你只需要在 Deployment 中描述您想要的目标状态是什么，Deployment controller 就会帮您将 Pod 和 ReplicaSet 的实际状态改变到您的目标状态。Deployment controller 就会帮您将 Pod 和ReplicaSet 的实际状态改变到您的目标状态。',
              help_url: Vue.filter('help_url')('deployment'),
              route: {
                name: 'resource.deployments.list',
              },
              deployRoute: {
                name: 'resource.deployments.list',
                query: {
                  create: true,
                },
              },
            },
          ],
        },
        {
          name: 'Service',
          services: [
            {
              available: 'available',
              name: 'Service',
              isDefault: true,
              createMessage:
                '您可以通过 Yaml 来定义 Service，并创建新的 Service 资源对象。',
              description:
                'Service 资源对象通常被用来定义一组 Pod 的访问策略，在集群内部暴露 Pod 或者其他服务供其他方面进行访问。',
              help_url: Vue.filter('help_url')('service'),
              route: {
                name: 'resource.services.list',
              },
              deployRoute: {
                name: 'resource.services.list',
                query: {
                  create: true,
                },
              },
            },
          ],
        },
        {
          name: 'Route',
          services: [
            {
              available: 'available',
              name: 'Route',
              isDefault: true,
              createMessage:
                '您可以通过页面引导定义 Route 的参数，并完成新的Route资源对象的创建。创建完成后就可以和应用绑定。',
              description:
                'Route 资源对象通常被用来将应用或者服务通过域名的方式暴露给集群外部的用户进行访问。',
              help_url: Vue.filter('help_url')('route'),
              route: {
                name: 'resource.routes.list',
              },
              deployRoute: {
                name: 'deploy.route',
              },
            },
          ],
        },
      ],
    },
    {
      name: '配置',
      children: [
        {
          name: 'Config Map',
          services: [
            {
              available: 'available',
              name: 'Config Map',
              isDefault: true,
              help_url: Vue.filter('help_url')('config-map'),
              description:
                'ConfigMap 提供了一种向容器中注入信息的机制，通常用来保存环境变量之类的配置信息。ConfigMap 可以通过卷挂载或者环境变量的方式向容器注入有用的信息。',
              createMessage:
                '您可以通过页面引导定义 ConfigMap 的各项参数，并完成新的 ConfigMap 资源对象的创建。',
              route: {
                name: 'resource.configmaps.list',
              },
              deployRoute: {
                name: 'deploy.config-map',
              },
            },
          ],
        },
        {
          name: 'Secret',
          services: [
            {
              available: 'available',
              name: 'Secret',
              isDefault: true,
              createMessage:
                '您可以通过页面引导定义 Secret 的各项参数，并完成新的 Secret 资源对象的创建。完成创建就可以将Secrets通过设置环境变量或者卷挂载的方式和应用绑定。',
              description:
                'Secret 提供了一种保存敏感信息的机制。这些敏感信息通常包括密码、dockercfg 文件、私有证书、环境变量等。应用可以通过环境变量或者卷挂载的方式引用 Secret。',
              help_url: Vue.filter('help_url')('secret'),
              route: {
                name: 'resource.secrets.list',
              },
              deployRoute: {
                name: 'deploy.secret',
                query: {
                  create: true,
                },
              },
            },
          ],
        },
      ],
    },
    {
      name: '存储',
      children: [
        {
          name: '存储',
          services: [
            {
              available: 'available',
              name: 'Persistent Volume Claim',
              isDefault: true,
              createMessage:
                '您可以通过页面引导定义 PVC 的各项参数，并完成新的PVC资源对象的创建。创建完成后就可以绑定应用路径实现数据的持久化存储。',
              description:
                'PersistentVolumeClaim 是用来挂载持久化的磁盘。PersistentVolumes 是用户在不知道特定云环境的细节的情况下，实现持久化存储的一种方式。',
              help_url: Vue.filter('help_url')('pvc'),
              route: {
                name: 'resource.persistentvolumeclaims.list',
              },
              deployRoute: {
                name: 'deploy.volume',
              },
            },
          ],
        },
      ],
    },
  ];
}
