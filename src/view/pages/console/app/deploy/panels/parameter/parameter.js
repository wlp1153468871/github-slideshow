import { INROUTER_KEY } from '@/core/constants/constants';
import { mapState } from 'vuex';
import { first, kebabCase, get as getValue, find } from 'lodash';
import DockerImage from '@/core/lib/docker-parse-image';

import ApplicationService from '@/core/services/application.service';
import ConfigMapService from '@/core/services/config-map.service';
import SecretService from '@/core/services/secret.service';
// sections
import EnvSection from '@/view/pages/console/app/deploy/sections/env';
import MountFileSection from '@/view/pages/console/app/deploy/sections/mount-file';
import SpaceZoneSection from '@/view/components/space-zone/space-zone';
// sections
import AffinitySection from './affinity.section';
import CommandSection from './command.section';
import ImageSection from './image.section';
import NameSection from './name.section';
import PlanSection from './plan.section';
import PodSection from './pod.section';
import RouteSection from './route.section';
import VolumeSection from './volume.section';

export default {
  name: 'ParameterPanel',

  components: {
    EnvSection,
    MountFileSection,
    // sections
    AffinitySection,
    CommandSection,
    ImageSection,
    NameSection,
    VolumeSection,
    PlanSection,
    PodSection,
    RouteSection,
    SpaceZoneSection,
  },

  data() {
    return {
      form: {
        // 选择镜像
        name: '',
        version: '',
        deploymentKind: null,
        repository: '', // TODO(jerry) from props
        deployMode: '', // TODO(jerry) from props
        // 规格
        plan: {
          limits: {
            cpu: { value: '1', unit: 'core' },
            memory: { value: '4', unit: 'g' },
          },
          requests: {
            cpu: { value: '1', unit: 'core' },
            memory: { value: '4', unit: 'g' },
          },
        },
        // 部署策略
        affinity: 'none',
        affinityConfig: '',
        // 容器配置
        podModel: {},
        // 负载均衡
        autoRoute: true,
        exposeKind: null,
        hostname: '',
        port: '80',
        path: '/',
        // 存储卷
        volumes: [],
        // 环境配置
        envs: [],
        // 挂载 Config Map
        configFiles: [],
        // 启动参数
        cmd: '',
        args: '',
      },
      configMaps: [],
      secrets: [],
    };
  },

  computed: {
    ...mapState(['space', 'zone', 'quotaDict']),

    inrouterDomain() {
      return getValue(
        find(this.zone.router_config, { key: INROUTER_KEY }),
        'domain',
      );
    },
  },

  created() {
    this.listConfigMap();
    this.listSecret();
  },

  watch: {
    'form.repository': {
      handler(repository) {
        if (repository === '') return;

        const image = DockerImage(repository);
        // 最多取 20 位, 因为后端是给(名字+随机数)的组合;
        // 从后 name 的后半部分, 尽可能避免重复的可能性;
        let name = kebabCase(image.repository).substr(-20);
        this.getRecommendedName(name).then(res => {
          if (!res.is_existed) {
            name = first(res.recommend_names);
          }
          this.form.name = name; // eslint-disable-line

          if (!this.form.hostname) {
            this.form.hostname = name;
          }
        });
      },
    },
  },

  methods: {
    providePartialModel() {
      return this.form;
    },

    async listConfigMap() {
      return ConfigMapService.listConfigMap(this.space.id, this.zone.id).then(res => {
        this.configMaps = res.items;
      });
    },

    async listSecret() {
      return SecretService.listSecret(this.space.id, this.zone.id).then(res => {
        this.secrets = res.items;
      });
    },

    onModelChanged(val) {
      this.form = { ...this.form, ...val };
    },

    onDeployModeChanged(val) {
      this.deployMode = val;
    },

    getRecommendedName(name) {
      return ApplicationService.getRecommendedName(
        this.space.id,
        name, // repository name
      );
    },
  },
};
