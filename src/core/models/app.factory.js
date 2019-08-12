import { first, find } from 'lodash';
import ImageParser from '@/core/lib/docker-parse-image';
import {
  DEPLOYMENT_SERVICE,
  VOLUME_SERVICE,
  PLANKEY,
} from '@/core/constants/constants';

const FIELDS = [
  'applicationid',
  'applicationname',
  'configFiles',
  'consoleurl',
  'containerport',
  'containercmd',
  'containerparams',
  'createdate',
  'envs',
  'imagename',
  'namespace',
  'registrydomain',
  'clustersize',
  'requiredcpu',
  'requiredmemory',
  'status',
  'team',
  'updatedate',
  'binding_instances',
];

class AppFactory {
  static fromInstance(instance, other) {
    const metadata = instance.instance_metadata || {};
    const bindings = instance.binding_instances || [];
    const { bullets } = instance.plan;

    const { clustersize, dashboard_url, parameters } = metadata;

    const app = {
      ...parameters,
      ...other,
    };

    // handler parse
    let image = {};
    if (app.imagename) {
      image = ImageParser(app.imagename);
    }

    // handler envs
    let { envs } = app;

    if (typeof envs === 'string') {
      try {
        envs = JSON.parse(envs);
      } catch (err) {
        console.error('parsed envs error');
      }
    }

    const { configFiles } = app;
    // bindings
    const volumes = [];
    const deployments = [];
    bindings.forEach(binding => {
      const type = binding.service_type;
      if (type === DEPLOYMENT_SERVICE) {
        deployments.push(binding);
      } else if (type === VOLUME_SERVICE) {
        volumes.push(AppFactory.flattenVolume(binding));
      }
    });

    app.image = image;
    app.envs = envs;
    app.configFiles = configFiles;
    app.clustersize = clustersize;
    app.consoleURL = dashboard_url;
    app.volumes = volumes;
    app.deployments = deployments;
    app.cpu = find(bullets, { name: PLANKEY.CPU });
    app.memory = find(bullets, { name: PLANKEY.MEMORY });

    return app;
  }

  static flattenVolume(volume) {
    const { params, ...rest } = volume;
    const detail = first(params);
    return {
      ...rest,
      ...detail,
    };
  }

  static toInfo(app) {
    const infos = [];
    AppFactory.FIELDS.forEach(name => {
      let value = app[name];
      if (value) {
        if (name === 'clustersize') value = parseInt(app.replica, 10) || 1;
        if (name === 'binding_instances') {
          value = [...value, ...app.deployments];
        }
        infos.push({
          name,
          value,
          type: 'string',
        });
      }
    });
    return infos;
  }
}

AppFactory.FIELDS = FIELDS;

export default AppFactory;
