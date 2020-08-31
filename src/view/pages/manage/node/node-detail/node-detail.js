import NodeService from '@/core/services/node.service';
import { orderBy } from 'lodash';
import NodeOperationDialog from '../../../dialogs/node/node-operation.vue';
import Node from '../node-list/node';

// panels
import OverviewPanel from './panels/overview';
import SystemPanel from './panels/system';
import EventPanel from './panels/event';
import PodsPanel from './pod/list/pods';
import NodeTaint from '../../../../components/node-taint/node-taint';
import HoverCard from '../../../../components/hover-card/hover-card';

export default {
  name: 'NodeList',
  components: {
    OverviewPanel,
    SystemPanel,
    EventPanel,
    PodsPanel,
    NodeOperationDialog,
    NodeTaint,
    HoverCard,
  },
  data() {
    return {
      loading: {
        page: false,
        event: false,
      },
      catalog: [],
      activeCatalog: '',
      node: {},
      resource: {},
      processedData: {},
      other: {
        status: (_, item) => (this.checkCondition(item.status.conditions) === '未就绪' ? 'DANGER' : 'SUCCESS'),
      },
    };
  },
  created() {
    this.init();
    this.getNodeDetail();
  },
  methods: {
    init() {
      this.catalog = [
        { label: '概览', id: 'overview' },
        { label: '系统', id: 'system' },
        { label: '事件', id: 'event' },
        { label: '容器组', id: 'pods' }];
      [,,, this.activeCatalog] = [...this.catalog].reverse();
    },

    getNodeDetail() {
      this.loading.page = true;
      NodeService.getNodeDetail(this.$route.params.node, this.$route.params.zone).then(res => {
        this.node = res;
        this.resource = {
          key: this.node.metadata.uid,
          name: this.node.metadata.name,
          icon: '#icon_node',
          logo: '#icon_node-logo',
          links: [
            { text: '节点管理', route: { name: 'manage.node.list' } },
            { text: this.node.metadata.name },
          ],
        };
        this.processedData = new Node(res);
      })
        .finally(() => {
          this.loading.page = false;
        });
    },

    handleOperate(command, node) {
      const zoneId = this.$route.params.zone;
      switch (command) {
        case 'modifyAnno':
          this.$refs.NodeOperationDialog.onModifyAnno(node, zoneId);
          break;
        case 'modifyTaint':
          this.$refs.NodeOperationDialog.onModifyTaint(node, zoneId);
          break;
        case 'schedulingDisabled':
          this.$refs.NodeOperationDialog.onSchedulingDisabled(node, zoneId);
          break;
        case 'continueScheduling':
          this.$refs.NodeOperationDialog.onContinueScheduling(node, zoneId);
          break;
        default:
          console.error('Unexpected message');
      }
    },

    openModifyTagDialog(node) {
      this.$refs.NodeOperationDialog.onModifyTag(node, this.$route.params.zone);
    },

    checkCondition(condition) {
      const conditionsArray = condition.map(item => {
        return ((item.type === 'Ready' && item.status === 'True') || (item.type !== 'Ready' && item.status === 'False'));
      },
      );
      return conditionsArray.indexOf(false) > 0 ? '未就绪' : '健康';
    },
    sortEvents(events) {
      return orderBy(events, 'firstTimestampValue', 'desc');
    },
  },
};
