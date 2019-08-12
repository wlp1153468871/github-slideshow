import { mapState, mapGetters } from 'vuex';
import { first } from 'lodash';
import tableView from '@/view/mixins/table-view';
import ChargingService from '@/core/services/charging.service';

export default {
  name: 'OrderList',
  extends: tableView('id', 10, 'start_time', 'desc'),
  created() {
    this.initTableView();
  },
  data() {
    return {
      orgId: '',
      spaceId: '',
      rows: [],
      order: {}, // selected row
      panelConfigs: {
        visible: true,
      },
    };
  },
  computed: {
    ...mapState(['orgs']),
    ...mapGetters(['getOrgSpaces']),
    spaces() {
      return this.orgId ? this.getOrgSpaces(this.orgId) : [];
    },
    orderInstance() {
      const { row } = this;
      return {
        row,
      };
    },
  },
  watch: {
    orgs: {
      immediate: true,
      handler(orgs) {
        const org = first(orgs);
        if (org) {
          this.orgId = org.id;
        }
      },
    },
    spaces: {
      immediate: true,
      handler(spaces) {
        const space = first(spaces);
        if (space) {
          this.spaceId = space.id;
        }
      },
    },
    spaceId: {
      immediate: true,
      handler(spaceId) {
        if (spaceId) {
          this.laodUserOrder();
        }
      },
    },
  },
  methods: {
    initTableView() {
      this.setTableProps([
        { id: 'order_code', name: '订单号' },
        { id: 'order_type', name: '订单类型', filter: 'order_type' },
        { id: 'owner_name', name: '创建人' },
        { id: 'product_name', name: '服务名' },
        { id: 'resource_name', name: '实例名' },
        { id: 'order_status', name: '状态', filter: 'order_status' },
        { id: 'amount', name: '价格(元)', filter: 'fen_2_yuan' },
        { id: 'start_time', name: '创建时间', filter: 'unix_date' },
      ]);
      const isPay = item => item.amount >= 0;
      const isRefund = item => item.amount < 0;
      this.setTableOperations([
        { name: '支付', event: 'confirm-pay', visible: isPay },
        { name: '退款', event: 'confirm-refund', visible: isRefund },
      ]);
    },

    laodUserOrder() {
      const params = {
        space_id: this.spaceId,
        'space.organization_id': this.orgId,
      };
      ChargingService.getAllChargingOrders(params).then(list => {
        this.rows = list;
      });
    },

    confirmPay() {
      this.$tada({
        icon: 'warning',
        title: '温馨提示',
        text: '平台暂未开启支付功能，您可以正常使用已经下单的产品。',
        buttons: [false, '确定'],
      });
    },

    confirmRefund() {
      this.$tada({
        icon: 'warning',
        title: '温馨提示',
        text: '平台暂未开启退款功能，您可以正常使用已经下单的产品。',
        buttons: [false, '确定'],
      });
    },

    onCheckedRowsChange(rows) {
      const [row = {}] = rows;
      this.order = row;
    },
  },
};
