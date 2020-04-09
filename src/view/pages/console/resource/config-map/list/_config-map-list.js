import Vue from 'vue';
import { get as getValue } from 'lodash';
import ConfigMapService from '@/core/services/config-map.service';
import isApprove from '@/core/utils/is-approve';
import joinApproveStatus from '@/core/utils/joinApproveStatus.js';
import ErrorInfo from '@/view/mixins/error-info';
import ResourceMixin from '@/view/mixins/resource';
import ErrorInfoDialog from '@/view/pages/dialogs/instance/error-info';
import EditYamlDialog from '@/view/components/yaml-edit/edit-yaml';
import { RESOURCE_TYPE } from '@/core/constants/resource';

export default {
  name: 'configMapList',

  mixins: [ErrorInfo, ResourceMixin(RESOURCE_TYPE.CONFIG_MAP)],

  components: {
    ErrorInfoDialog,
    EditYamlDialog,
  },

  data() {
    return {
      rows: [],
      selectedYaml: {},
      loadings: {
        configMap: true,
        table: true,
      },
      dialogConfigs: {
        errorInfo: { visible: false },
        editYaml: { visible: false },
      },
      yamlJSON: {},
      configMap: {},
      filterMethod: (data, filterKey) => data.metadata.name.toLowerCase().includes(filterKey),
    };
  },

  created() {
    this.loadInstances();
  },

  methods: {
    disableDelete(item) {
      return isApprove(item.approveStatus);
    },

    loadInstances() {
      this.loadings.table = true;
      ConfigMapService.listConfigMap(this.space.id, this.zone.id)
        .then(res => {
          this.rows = joinApproveStatus(res);
        })
        .finally(() => {
          this.loadings.table = false;
          this.loadings.configMap = false;
        });
    },

    createConfigMap() {
      this.$router.push({
        name: 'deploy.configmaps',
        query: {
          serviceId: this.brokerServiceId,
        },
      });
    },

    gotoDetail(configMap) {
      this.$router.push({
        name: 'resource.configmaps.detail',
        params: {
          name: configMap.metadata.name,
        },
      });
    },

    confirmDelete(configMap) {
      const name = getValue(configMap, 'metadata.name');

      this.$tada
        .confirm({
          title: '删除 Config Map',
          text: `若应用使用了该 Config Map，将会受到影响。您确定要删除 Config Map ${name} 吗？`,
        })
        .then(willDelete => {
          if (willDelete) {
            this.deleteConfigMap(name);
          }
        });
    },

    deleteConfigMap(name) {
      ConfigMapService.deleteConfigMap(this.space.id, this.zone.id, name).then(() => {
        this.$noty.success(`开始执行对 Config Map ${name}的删除操作`);
        this.loadInstances();
      });
    },

    humanizeLabel(configMap) {
      const {
        metadata: { labels = [] },
      } = configMap;
      return (
        Object.entries(labels)
          .map(([key, value]) => `${key} : ${value}`)
          .join(' ')
          .trim() || '-'
      );
    },

    sortName(a, b) {
      return a > b;
    },

    handleOperate(command, configMap) {
      if (command === 'edit') {
        this.gotoDetail(configMap);
      }
      if (command === 'delete') {
        this.confirmDelete(configMap);
      }
    },

    dateFormat(row) {
      const date = getValue(row, 'metadata.creationTimestamp');
      return date ? Vue.filter('date')(date) : '-';
    },
  },
};
