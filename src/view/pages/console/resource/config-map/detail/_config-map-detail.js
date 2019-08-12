import { get as getValue, orderBy } from 'lodash';
import { mapState } from 'vuex';
import { CONFIG_TITLE_TYPE } from '@/core/constants/constants';
import { RESOURCE } from '@/core/constants/resource';
import ConfigMapService from '@/core/services/config-map.service';
import InstanceService from '@/core/services/instance.service';
// panels
import LabelsTable from '../../_panels/labels-table';
import SeniorPanel from '../../_panels/senior';
import EventPanel from '../../_panels/event';

export default {
  name: 'ConfigMapDetail',

  components: {
    LabelsTable,
    SeniorPanel,
    EventPanel,
  },

  data() {
    const { name: configMapName } = this.$route.params;
    const TABS = {
      OVERVIEW: '概览',
      EVENT: '操作记录',
      SENIOR: '高级设置',
    };

    return {
      configMapName,
      CONFIG_TITLE_TYPE,
      TABS,
      configMap: {
        metadata: {},
      },
      data: {},
      labels: {},
      annotations: {},
      events: [],
      status: '',
      loadings: {
        configMap: false,
      },
    };
  },

  computed: {
    ...mapState(['space', 'zone']),

    resource() {
      return {
        ...RESOURCE.CONFIG_MAP,
        links: [
          { text: 'ConfigMaps', route: { name: 'resource.config-maps' } },
          { text: this.configMapName },
        ],
      };
    },
  },

  created() {
    this.loadConfigMapDetail();
  },

  methods: {
    loadConfigMapDetail() {
      this.loadings.configMap = true;
      return ConfigMapService.getConfigMap(this.space.id, this.zone.id, this.configMapName)
        .then(instance => {
          const {
            originData: configMap,
            id: instanceId,
            status,
          } = instance;

          this.configMap = configMap;
          this.initLabelsTable(configMap);
          this.status = status;

          if (instanceId) {
            this.loadEvents(instanceId);
          }
        })
        .finally(() => {
          this.loadings.configMap = false;
        });
    },

    loadEvents(instanceId) {
      InstanceService.getLogs(instanceId).then(events => {
        this.events = orderBy(events, 'started_at', 'desc');
      });
    },

    initLabelsTable(configMap) {
      this.data = getValue(configMap, 'data', {});
      this.labels = getValue(configMap, 'metadata.labels', {});
      this.annotations = getValue(configMap, 'metadata.annotations', {});
    },

    editData(data) {
      this.update(data, this.labels, this.annotations);
    },

    editLabel(labels) {
      this.update(this.data, labels, this.annotations);
    },

    editAnnotations(annotations) {
      this.update(this.data, this.labels, annotations);
    },

    parseAsConfigMap(data, labels, annotations) {
      // const { data, labels, annotations } = this;
      const namespace = this.space.short_name;
      return {
        apiVersion: 'v1',
        kind: 'ConfigMap',
        data,
        metadata: {
          name: this.configMapName,
          namespace,
          annotations,
          labels,
        },
      };
    },

    update(data, labels, annotations) {
      const configMap = this.parseAsConfigMap(data, labels, annotations);

      ConfigMapService.updateConfigMap(
        this.space.id,
        this.zone.id,
        this.configMapName,
        configMap,
      ).then(() => {
        return this.loadConfigMapDetail();
      }).then(() => {
        if (this.status === 'approving') {
          this.$noty.success('已提交审批请求...');
        } else {
          this.$noty.success('正在更新...');
        }
      });
    },

    deleteConfigMap() {
      ConfigMapService
        .deleteConfigMap(this.space.id, this.zone.id, this.configMapName)
        .then(() => {
          this.$router.push(RESOURCE.CONFIG_MAP.route);
          this.$noty.success(`成功删除 ConfigMap ${this.configMapName}`);
        });
    },
  },
};
