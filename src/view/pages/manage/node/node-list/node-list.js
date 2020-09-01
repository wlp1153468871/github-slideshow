import NodeService from '@/core/services/node.service';
import ZoneService from '@/core/services/zone.service';
import { head } from 'lodash';
import Node from './node';
import HoverCard from '../../../../components/hover-card/hover-card';
import HoverCardValue from '../../../../components/hover-card/hover-card-value';
import NodeTaint from '../../../../components/node-taint/node-taint';
import NodeOperationDialog from '../../../dialogs/node/node-operation.vue';

export default {
  name: 'NodeList',
  components: {
    HoverCard,
    HoverCardValue,
    NodeTaint,
    NodeOperationDialog,
  },
  props: ['hideZoneSelect', 'zone'],
  data() {
    return {
      node: [],
      beforeProcessNode: [],
      zoneList: [],
      currentZone: '',
      loadings: {
        node: false,
      },
      isCreating: false,
      filterMethod: (data, filterKey) => data.name.toLowerCase().includes(filterKey),
      other: {
        status: (_, item) => (this.checkCondition(item.k8sNodeStatus.conditions) === '未就绪' ? 'DANGER' : 'SUCCESS'),
      },
    };
  },

  created() {
    // 有权限查看 无权限则提示
    if (this.$can('platform.node.get')) {
      this.getZonesList();
    } else {
      this.$noty.error('您暂无节点管理查看权限');
    }
  },

  computed: {
    showNodeTitle() {
      return !this.hideZoneSelect;
    },
  },

  methods: {
    getZonesList() {
      this.loadings.node = true;
      return ZoneService.getZones()
        .then(zones => {
          this.zoneList = zones.filter(item => { return item.available; });
          if (this.currentZone) {
            this.currentZone = this.currentZone;
          } else {
            this.currentZone = this.zone ? this.zone.id : head(this.zoneList).id;
          }
          this.getNodeList(this.currentZone);
        });
    },

    getNodeList(zoneid) {
      NodeService.get(zoneid).then(res => {
        this.beforeProcessNode = res;
        this.node = res.items.map(kNodes => {
          this.loadings.node = false;
          return new Node(kNodes);
        });
      })
        .finally(() => {
          this.loadings.node = false;
        });
    },

    changeZone(zoneid) {
      this.loadings.node = true;
      this.currentZone = zoneid;
      this.getNodeList(zoneid);
    },

    checkCondition(condition) {
      const conditionsArray = condition.map(item => {
        // return item.type === 'schedulingDisabled';
        return ((item.type === 'Ready' && item.status === 'True') || (item.type !== 'Ready' && item.status === 'False'));
      },
      );
      return conditionsArray.indexOf(false) > 0 ? '未就绪' : '健康';
    },

    handleOperate(command, node) {
      const nodeData = this.beforeProcessNode.items.find(item =>
        item.metadata.name === node.hostname,
      );
      switch (command) {
        case 'modifyTag':
          this.$refs.NodeOperationDialog.onModifyTag(nodeData, this.currentZone);
          break;
        case 'modifyAnno':
          this.$refs.NodeOperationDialog.onModifyAnno(nodeData, this.currentZone);
          break;
        case 'modifyTaint':
          this.$refs.NodeOperationDialog.onModifyTaint(nodeData, this.currentZone);
          break;
        case 'schedulingDisabled':
          this.$refs.NodeOperationDialog.onSchedulingDisabled(nodeData, this.currentZone);
          break;
        case 'continueScheduling':
          this.$refs.NodeOperationDialog.onContinueScheduling(nodeData, this.currentZone);
          break;
        default:
          console.error('Unexpected message');
      }
    },

  },
};
