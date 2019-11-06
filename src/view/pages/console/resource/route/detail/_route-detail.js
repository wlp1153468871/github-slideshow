import { RESOURCE_TYPE } from '@/core/constants/resource';
import { mapState } from 'vuex';
import { orderBy, get as getValue, keyBy } from 'lodash';
import ResourceMixin from '@/view/mixins/resource';
import ServiceService from '@/core/services/service.resource.service';
import InstanceService from '@/core/services/instance.service';
import EditYamlDialog from '@/view/components/yaml-edit/edit-yaml';
import RouteService from '@/core/services/route.service';
// panels
import OverviewPanel from './panels/overview';
import RulePanel from './panels/rule';
import JobsPanel from './panels/jobs';

export default {
  name: 'VolumeDetail',

  mixins: [ResourceMixin(RESOURCE_TYPE.ROUTE)],

  components: {
    OverviewPanel,
    RulePanel,
    JobsPanel,
    EditYamlDialog,
  },

  data() {
    const TABS = {
      OVERVIEW: { label: '概览', name: 'overview' },
      RULE: { label: 'Route 规则', name: 'rule' },
      JOBS: { label: '操作记录', name: 'jobs' },
    };

    return {
      dialogConfigs: {
        yamlEdit: false,
      },
      TABS,
      tab: TABS.OVERVIEW.name,
      loadings: {
        page: true,
      },
      instance: {},
      route: {},
      status: '',
      information: {
        basic: {},
        config: {},
      },
      jobs: [],
      services: {},
    };
  },

  computed: {
    ...mapState(['space', 'zone']),
  },

  created() {
    this.getRoute();
    this.getServices();
  },

  methods: {
    getServices() {
      ServiceService.list().then(serviceList => {
        this.services = keyBy(serviceList.items, 'metadata.name');
      });
    },

    getJobs() {
      if (!this.instance.id) return;
      InstanceService.getLogs(this.instance.id).then(jobs => {
        this.jobs = orderBy(jobs, 'started_at', 'desc');
      });
    },

    getRoute() {
      this.loadings.detail = true;
      RouteService.get(this.space.id, this.zone.id, this.name)
        .then(res => {
          this.instance = res;
          this.status = res.status;
          this.getJobs();
          this.route = res.originData || {};
          // this.cert.ref = getValue(res, 'instance_metadata.parameters.certificateRef') || {};
          this.information.basic = {
            '租户 / 项目组': `${res.organizationName ||
              this.space.name} / ${res.spaceName ||
              this.space.organization.name}`,
            '区域 / 环境': res.zoneName || this.zone.name,
            创建者: res.owner.name || '暂无',
          };
          this.information.config = {
            请求路径: `${this.route.spec.path || '暂无'}`,
            服务: `${this.route.spec.to.name}`,
            容器组端口: `${getValue(
              this.route.spec.port,
              'targetPort',
              '任意',
            )}`,
          };
        })
        .finally(() => {
          this.loadings.detail = false;
          this.loadings.page = false;
        });
    },

    removeConfirm() {
      const { name } = this;
      this.$tada
        .confirm({
          title: '删除 Route ',
          text: `您确定要删除 Route ${name} 吗？`,
        })
        .then(willDelete => {
          if (willDelete) this.removeRoute();
        });
    },

    removeRoute() {
      const { name } = this;
      RouteService.delete(this.space.id, this.zone.id, name).then(() => {
        this.$noty.success(`开始执行对 Route ${name} 的删除操作`);
        this.goBack();
      });
    },

    updateByYaml(data) {
      const {
        metadata: { name },
      } = this.route;
      RouteService.updateByYaml({ name, data }).then(() => {
        this.$noty.success('更新成功');
        this.getRoute();
        this.getServices();
      });
    },
  },
};
