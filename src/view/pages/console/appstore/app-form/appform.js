import { INROUTER_KEY } from '@/core/constants/constants';
import { mapState } from 'vuex';
import { isEmpty, get as getValue, find, cloneDeep } from 'lodash';
import ShellQuote from 'shell-quote';
import { convert } from '@/core/utils';
import { FormWizard, TabContent } from 'vue-form-wizard';
import { DEPLOYMENT_TYPE } from '@/core/constants/app';
import ApplicationService from '@/core/services/application.service';

import SpaceZoneSection from '@/view/components/space-zone/space-zone';

export default {
  name: 'AppStoreForm',

  provide: ['$validator'],

  components: {
    FormWizard,
    TabContent,
    SpaceZoneSection,
  },

  data() {
    return {
      select: 1,
      items: [
        {
          text: '默认租户',
          value: 1,
        },
        {
          text: '租户1',
          value: 2,
        },
      ],
      instance: {},
      form: {
        repository: '',
        form: [],
      },
      instanceError: {},
      loadings: {
        purchasing: false,
      },
      isShowResult: false,
    };
  },

  computed: {
    ...mapState(['zone', 'space']),
  },

  methods: {
    onComplete() {
      this.deployApp();
      return true; // onComplete function need return `true`
    },

    onValidate(isValid, tabIndex) {
      if (isValid && tabIndex === 0) {
        this.form = {
          ...this.form,
          ...this.$refs.parameter.providePartialModel(),
        };
      }
      return isValid;
    },

    deployApp() {
      const params = this.parseAppParams();
      const instance = {};

      params.forEach(({ id, value }) => {
        instance[id] = value;
      });

      this.instanceError = {};
      this.loadings.purchasing = true;
      return ApplicationService.createInstance(this.space.id, this.zone.id, instance)
        .then(res => {
          this.instance = res;
        })
        .catch(err => {
          this.instanceError = err;
        })
        .finally(() => {
          this.isShowResult = true;
          this.loadings.purchasing = false;
        });
    },

    /* eslint-disable function-paren-newline */
    parseAppParams() {
      const {
        deployMode = 'image',
        deploymentKind,
        repository = '',
        name = '',
        version = '',
        affinity = 'affinity',
        affinityConfig = '',
        deployfile = {},
        // podAffinity = {},
        // podAntiAffinity = {},
        livenessProbe = {},
        readinessProbe = {},
        port,
        exposeKind,
        envs,
        configFiles,
        cmd,
        args,
        registryuser = '',
        registrypassword = '',
        volumes,
        monitor,
        hpa,
      } = this.form;

      const params = [];

      // 部署方式 镜像 或 war包
      // 选择镜像
      if (deployMode === 'image') {
        params.push(
          { id: 'imagename', value: repository },
          { id: 'registryuser', value: registryuser },
          { id: 'registrypassword', value: registrypassword },
        );
      } else {
        params.push({ id: 'deployfile', value: deployfile });
      }

      params.push({ id: 'deploymentKind', value: deploymentKind });

      // 租户 / 项目组
      // 地域与环境

      // 名称/版本
      params.push({ id: 'name', value: name }, { id: 'version', value: version });

      // 规格
      params.push({ id: 'plan', value: this.parsePlanParams() });

      // 部署策略: 亲和性, 反亲和性
      if (affinity !== 'none') {
        try {
          const { podAffinity, podAntiAffinity } = JSON.parse(affinityConfig);
          if (affinity === 'affinity') {
            params.push({ id: 'podAffinity', value: podAffinity });
          } else if (affinity === 'antiAffinity') {
            params.push({ id: 'podAntiAffinity', value: podAntiAffinity });
          }
        } catch (err) {
          console.log('你输入的 affinity 配置存在问题', err);
        }
      }

      // 容器配置: 存活检查, 就绪检查, 如果未空, 则不传
      if (!isEmpty(livenessProbe)) {
        const liveness = this.parsePodParams(livenessProbe);
        params.push({ id: 'livenessProbe', value: liveness });
      }
      if (!isEmpty(readinessProbe)) {
        const readiness = this.parsePodParams(readinessProbe);
        params.push({ id: 'readinessProbe', value: readiness });
      }

      // 负载均衡: 创建访问域名, 访问域名, 端口;
      params.push({ id: 'containerport', value: Number(port) });

      const { autoRoute } = this.form;
      if (autoRoute) {
        params.push({ id: 'exposeKind', value: exposeKind });
        if (exposeKind === 'Route') {
          params.push({ id: 'router', value: this.parseDeploymentParams() });
        } else if (exposeKind === 'Ingress') {
          params.push({ id: 'ingress', value: this.parseIngress() });
        }
      }

      // 存储卷
      params.push({ id: 'volumes', value: volumes });

      // 环境配置: 环境变量, 应用完整 Config Map
      const parsedEnvs = envs.filter(x => x.name !== '');
      params.push({ id: 'envs', value: parsedEnvs }, { id: 'configFiles', value: configFiles });

      // 挂载 Config Map

      // 启动方式: 启动命令, 参数
      params.push(
        { id: 'containercmd', value: ShellQuote.parse(cmd) || [] },
        { id: 'containerparams', value: ShellQuote.parse(args) || [] },
      );

      //  监控
      params.push({
        id: 'monitor',
        value: monitor,
      });

      // hpa
      params.push({
        id: 'hpa',
        value: hpa,
      });

      return params;
    },

    parseIngress() {
      const { name, hostname, version, port, path } = this.form;
      const namespace = this.space.short_name;
      const inrouter = find(this.zone.router_config, { key: INROUTER_KEY });
      const inrouterDomain = getValue(inrouter, 'domain');
      const domain = inrouterDomain ? `.${inrouterDomain}` : '';

      return {
        kind: 'Ingress',
        apiVersion: 'extensions/v1beta1',
        metadata: {
          name,
          namespace,
        },
        spec: {
          rules: [
            {
              host: `${hostname}${domain}`,
              http: {
                paths: [
                  {
                    path,
                    backend: {
                      serviceName: this.genServiceName(name, version),
                      servicePort: Number(port),
                    },
                  },
                ],
              },
            },
          ],
        },
      };
    },

    /* eslint-enable function-paren-newline */
    parseDeploymentParams() {
      const { name, hostname, version, path } = this.form;
      const namespace = this.space.short_name;
      const inrouter = find(this.zone.router_config, { key: INROUTER_KEY });
      const inrouterDomain = getValue(inrouter, 'domain');
      const domain = inrouterDomain ? `.${inrouterDomain}` : '';
      const router_label = getValue(inrouter, 'label');
      return {
        name,
        path,
        host: `${hostname}${domain}`,
        namespace,
        release_type: DEPLOYMENT_TYPE.DEFAULT,
        backend: {
          name: this.genServiceName(name, version),
        },
        router_label,
      };
    },

    /**
     * [约定]
     * 创建应用的时候, 后端会根据如下的命名规则来创建 Service;
     * Route 和 Service 的绑定仅仅靠名字来绑定,
     * 如果后端改了 Service 的命名规则, 前端也得改!
     * @param {String} name application's name
     * @param {String} version application' version
     */
    genServiceName(name, version) {
      return `${name}-${version}`;
    },

    parsePodParams(livenessOrreadinessProbe) {
      const probe = cloneDeep(livenessOrreadinessProbe);
      if (probe.exec && probe.exec.command) {
        probe.exec.command = ShellQuote.parse(probe.exec.command) || [];
      }
      return probe;
    },

    parsePlanParams() {
      const { plan } = this.form;

      const parsePlan = requirePlan => {
        return Object.entries(requirePlan).map(([name, kv]) => {
          let { value, unit } = kv; // eslint-disable-line
          if (name === 'memory') {
            unit = 'm'; // force m
            value = convert(value, unit, 'g');
          }
          return {
            name,
            value: String(value),
            unit,
          };
        });
      };

      const limits = parsePlan(plan.limits);
      const requests = parsePlan(plan.requests);

      return {
        clustersize: 1, // TODO(jerry) v.2 FORCE clustersize is 1;
        limits,
        requests,
      };
    },

    hideResult() {
      this.isShowResult = false;
    },

    validateParameters() {
      const ref = this.$refs.parameter;
      return new Promise((resolve, reject) => {
        ref.$validator.validateAll().then(valid => {
          valid = valid && !this.veeErrors.items.length;
          if (valid) {
            resolve(true);
          } else {
            reject();
          }
        });
      });
    },
  },
};
