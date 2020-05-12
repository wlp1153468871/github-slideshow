import { RESOURCE_TYPE } from '@/core/constants/resource';
import Resource from '@/view/components/resource/resource-link/resource';
import Vue from 'vue';

class Service {
  available = 'available';
  isDefault = true;
  help_url = null;
  route = null;
  deployRoute = null;
  name = '';
  createMessage = '';
  description = '';

  constructor(kind, description, createMessage, route, deployRoute) {
    const resource = new Resource(kind);
    this.help_url = Vue.filter('help_url')[kind];
    this.name = kind;
    this.description = description;
    this.createMessage = createMessage;
    this.route = route || resource.route;
    this.deployRoute = deployRoute || resource.deployRoute;
  }
}

class Kind {
  name = '';
  kind = '';
  services = [];

  constructor(kind, description, createMessage, route, deployRoute) {
    this.name = kind;
    this.kind = kind;
    this.services = [new Service(kind, description, createMessage, route, deployRoute)];
  }
}

export default function getDefaultMenus() {
  return [
    {
      name: '应用部署',
      children: [
        new Kind(
          RESOURCE_TYPE.APPLICATION,
          '应用是为实现特定业务目标而创建的一组相关联的资源对象，通常会包含 Deployment 或 Deployment Config、Service、Router 等。',
          '部署您自己的应用。您可以使用构建好的应用镜像，快速完成应用的部署，部署动作将产生多个资源对象。',
          {
            name: 'console.applications.list',
          },
          {
            name: 'deploy.applications',
          },
        ),
        new Kind(
          RESOURCE_TYPE.DEPLOYMENT_CONFIG,
          '应用是为实现特定业务目标而创建的一组相关联的资源对象，通常会包含 Deployment 或 Deployment Config、Service、Router 等。',
          '部署您自己的应用。您可以使用构建好的应用镜像，快速完成应用的部署，部署动作将产生多个资源对象。',
        ),
        new Kind(
          RESOURCE_TYPE.DEPLOYMENT,
          'Deployment为Pod和Replica Set（升级版的 Replication Controller）提供声明式的更新。你只需要在 Deployment 中描述您想要的目标状态是什么，Deployment controller 就会帮您将 Pod 和 ReplicaSet 的实际状态改变到您的目标状态。Deployment controller 就会帮您将 Pod 和ReplicaSet 的实际状态改变到您的目标状态。',
          '您可以通过Yaml来定义 Deployment，并创建一个 Deployment 资源对象。',
        ),
        new Kind(
          RESOURCE_TYPE.SERVICE,
          'Service 资源对象通常被用来定义一组 Pod 的访问策略，在集群内部暴露 Pod 或者其他服务供其他方面进行访问。',
          '您可以通过 Yaml 来定义 Service，并创建新的 Service 资源对象。',
        ),
        new Kind(
          RESOURCE_TYPE.ROUTE,
          'Route 资源对象通常被用来将应用或者服务通过域名的方式暴露给集群外部的用户进行访问。',
          '您可以通过页面引导定义 Route 的参数，并完成新的Route资源对象的创建。创建完成后就可以和应用绑定。',
        ),
        new Kind(
          RESOURCE_TYPE.INGRESS,
          'Ingress 资源对象通常被用来将应用或者服务通过域名的方式暴露给集群外部的用户进行访问。',
          '您可以通过页面引导定义 Ingress 的参数，并完成新的Route资源对象的创建。创建完成后就可以和应用绑定。',
        ),
      ],
    },
    {
      name: '配置',
      children: [
        new Kind(
          RESOURCE_TYPE.CONFIG_MAP,
          'ConfigMap 提供了一种向容器中注入信息的机制，通常用来保存环境变量之类的配置信息。ConfigMap 可以通过卷挂载或者环境变量的方式向容器注入有用的信息。',
          '您可以通过页面引导定义 ConfigMap 的各项参数，并完成新的 ConfigMap 资源对象的创建。',
        ),
        new Kind(
          RESOURCE_TYPE.SECRET,
          'Secret 提供了一种保存敏感信息的机制。这些敏感信息通常包括密码、dockercfg 文件、私有证书、环境变量等。应用可以通过环境变量或者卷挂载的方式引用 Secret。',
          '您可以通过页面引导定义 Secret 的各项参数，并完成新的 Secret 资源对象的创建。完成创建就可以将Secrets通过设置环境变量或者卷挂载的方式和应用绑定。',
        ),
      ],
    },
    {
      name: '存储',
      children: [
        new Kind(
          RESOURCE_TYPE.PERSISTENT_VOLUME_CLAIM,
          'PersistentVolumeClaim 是用来挂载持久化的磁盘。PersistentVolumes 是用户在不知道特定云环境的细节的情况下，实现持久化存储的一种方式。',
          '您可以通过页面引导定义 PVC 的各项参数，并完成新的PVC资源对象的创建。创建完成后就可以绑定应用路径实现数据的持久化存储。',
        ),
      ],
    },
  ];
}
