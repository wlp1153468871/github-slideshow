import { RESOURCE } from '@/core/constants/resource';
import { mapState } from 'vuex';
import { orderBy, isEmpty } from 'lodash';
import InstanceService from '@/core/services/instance.service';
import VolumeService from '@/core/services/volume.service';

// panels
import OverviewPanel from './panels/overview';
import JobsPanel from './panels/jobs';

export default {
  name: 'VolumeDetail',

  components: {
    OverviewPanel,
    JobsPanel,
  },

  data() {
    const TABS = {
      OVERVIEW: { label: '概览', name: 'overview' },
      JOBS: { label: '操作记录', name: 'jobs' },
      SETTING: { label: '设置', name: 'setting' },
    };

    const { name } = this.$route.params;

    return {
      resource: {
        ...RESOURCE.PERSISTENT_VOLUME_CLAIM,
        links: [
          {
            text: RESOURCE.PERSISTENT_VOLUME_CLAIM.name,
            route: { name: 'resource.persistent-volume-claims' },
          },
          { text: name },
        ],
      },
      name,
      TABS,
      tab: TABS.OVERVIEW.name,
      loadings: {
        page: true,
      },
      instance: {},
      volume: {},
      isEmpty,
      information: {
        basic: {},
      },
      jobs: [],
    };
  },

  computed: {
    ...mapState(['space', 'zone']),
  },

  created() {
    this.getVolume();
  },

  methods: {
    switchTab(tab) {
      this.tab = tab;
    },

    gotoTab(tab) {
      if (tab === 'events') {
        this.switchTab(this.TABS.EVENTS);
      }
    },

    getJobs() {
      if (!this.instance.id) return;
      InstanceService.getLogs(this.instance.id).then(jobs => {
        this.jobs = orderBy(jobs, 'started_at', 'desc');
      });
    },

    getVolume() {
      this.loadings.detail = true;
      VolumeService.getVolume(this.space.id, this.zone.id, this.name)
        .then(res => {
          this.instance = res;
          this.volume = res.originData || {};
          this.information.basic = {
            '租户 / 项目组': `${res.spaceName ||
              this.space.name} / ${res.organizationName ||
              this.space.organization.name}`,
            '区域 / 环境': res.zoneName || this.zone.name,
            创建者: res.owner.name || '暂无',
          };
          this.getJobs();
        })
        .finally(() => {
          this.loadings.detail = false;
          this.loadings.page = false;
        });
    },

    handleAction(actionId) {
      if (!actionId) return;

      const action = this.btns.find(x => x.id === actionId);
      InstanceService.executeActions(this.instanceId, action)
        .then(() => {
          this.$noty.success(`${action.name} 操作成功!`);
        })
        .catch(() => {
          this.$noty.error(`${action.name} 操作失败!`);
        });
    },

    removeConfirm() {
      const {
        metadata: { name },
      } = this.volume;
      this.$tada
        .confirm({
          title: '删除 PVC ',
          text: `您确定要删除 PVC ${name} 吗？`,
        })
        .then(willDelete => {
          if (willDelete) this.removeVolume(name);
        });
    },

    removeVolume(name) {
      this.isDeleting = true;
      this.$noty.success(`正在删除 PVC ${name} `);
      VolumeService.delete(this.space.id, this.zone.id, name).then(() => {
        this.$router.push({
          name: 'resource.persistent-volume-claims',
        });
        this.$noty.success(`删除 PVC ${name} 成功`);
        this.isDeleting = false;
      });
    },
  },
};
