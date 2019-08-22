import { RESOURCE_TYPE } from '@/core/constants/resource';
import { get as getValue, orderBy } from 'lodash';
import ResourceMixin from '@/view/mixins/resource';
import { CONFIG_TITLE_TYPE } from '@/core/constants/constants';
import ConfigMapService from '@/core/services/config-map.service';
import InstanceService from '@/core/services/instance.service';
// panels
import LabelsTable from '../../_panels/labels-table';
import SeniorPanel from '../../_panels/senior';
import EventPanel from '../../_panels/event';

export default {
  name: 'ConfigMapDetail',

  mixins: [ResourceMixin],

  components: {
    LabelsTable,
    SeniorPanel,
    EventPanel,
  },

  data() {
    const TABS = {
      OVERVIEW: '概览',
      EVENT: '操作记录',
      SENIOR: '高级设置',
    };

    return {
      kind: RESOURCE_TYPE.CONFIG_MAP,
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

  created() {
    this.loadConfigMapDetail();
  },

  methods: {
    loadConfigMapDetail() {
      this.loadings.configMap = true;
      return ConfigMapService.getConfigMap(
        this.space.id,
        this.zone.id,
        this.name,
      )
        .then(instance => {
          const { originData: configMap, id: instanceId, status } = instance;

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
      const { name } = this;
      const namespace = this.space.short_name;
      return {
        apiVersion: 'v1',
        kind: 'ConfigMap',
        data,
        metadata: {
          name,
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
        this.name,
        configMap,
      )
        .then(() => {
          return this.loadConfigMapDetail();
        })
        .then(() => {
          if (this.status === 'approving') {
            this.$noty.success('已提交审批请求...');
          } else {
            this.$noty.success('正在更新...');
          }
        });
    },

    deleteConfigMap() {
      ConfigMapService.deleteConfigMap(
        this.space.id,
        this.zone.id,
        this.name,
      ).then(() => {
        this.$noty.success(`成功删除 ConfigMap ${this.name}`);
        this.goBack();
      });
    },
  },
};
